package com.detagenix.bank_management_system.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.detagenix.bank_management_system.Mappper.MapStruct.KycMapper;
import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.entity.KycDocument;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.KycStatus;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.repository.KycDocumentRepository;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.KycService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycServiceimpl implements KycService {

    private final KycDocumentRepository kycRepository;
    private final UserRepository userRepository;
    private final KycMapper kycMapper;
    
    
    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of(
            "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"
    );
    
    
    @Override
    @Transactional
    public KycResponseDto submitKycInfo(kycRequestDto dto, Long userId) {
 
        log.info("Step 1 — Submitting KYC info for userId: {}", userId);
 
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
 
        // Guard: if VERIFIED, block all edits
        kycRepository.findByUser_UserId(userId).ifPresent(existing -> {
            if (existing.getKycStatus() == KycStatus.VERIFIED) {
                throw new IllegalStateException("KYC is already VERIFIED. Contact support to make changes.");
            }
            if (existing.getKycStatus() == KycStatus.SUBMITTED) {
                throw new IllegalStateException("KYC is already SUBMITTED and under review. Cancel first to resubmit.");
            }
        });
 
        // Fetch existing record or create a fresh one
        KycDocument kyc = kycRepository.findByUser_UserId(userId)
                .orElseGet(KycDocument::new);
 
        kyc.setUser(user);
        kyc.setAadharNumber(dto.getAadharNumber());
        kyc.setAadharName(dto.getAadharName());
        kyc.setDateOfBirth(dto.getDateOfBirth());
        kyc.setAddress(dto.getAddress());
        kyc.setPanNumber(dto.getPanNumber());
        kyc.setPanName(dto.getPanName());
        kyc.setInfoSubmitted(true);
        kyc.setKycStatus(KycStatus.PENDING);       // stays PENDING until all 3 steps done
        kyc.setDocumentType("AADHAAR_PAN");
 
        KycDocument saved = kycRepository.save(kyc);
        log.info("Step 1 completed for userId: {}", userId);
 
        return kycMapper.toResponseDto(saved);
    }
 
    // =========================================================
    //  STEP 2 — Upload PDF (photos of Aadhaar + PAN)
    // =========================================================
 
    @Override
    @Transactional
    public KycResponseDto submitKycDocuments(MultipartFile pdfFile, Long userId) {
 
        log.info("Step 2 — Submitting KYC documents PDF for userId: {}", userId);
 
        // Validate: Step 1 must be done first
        KycDocument kyc = kycRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No KYC record found. Please complete Step 1 (info submission) first."));
 
        if (!kyc.isInfoSubmitted()) {
            throw new IllegalStateException("Please complete Step 1 (KYC info) before uploading documents.");
        }
 
        guardAgainstFinalStatus(kyc);
 
        // Validate file
        if (pdfFile == null || pdfFile.isEmpty()) {
            throw new IllegalArgumentException("PDF file is required.");
        }
        if (!"application/pdf".equals(pdfFile.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are accepted for document upload.");
        }
 
        // Save file
        String fileName = userId + "_docs_" + System.currentTimeMillis() + "_" + sanitize(pdfFile.getOriginalFilename());
        Path savedPath = saveFile("uploads/kyc/documents/", fileName, pdfFile);
 
        kyc.setDocumentPath(savedPath.toString());
        kyc.setDocumentsSubmitted(true);
        kyc.setDocumentStatus(KycStatus.SUBMITTED);
 
        // Auto-advance: if all 3 steps done, move to SUBMITTED for admin review
        if (kyc.isInfoSubmitted() && kyc.isDocumentsSubmitted() && kyc.isVideoSubmitted()) {
            kyc.setKycStatus(KycStatus.SUBMITTED);
            log.info("All 3 KYC steps completed — status set to SUBMITTED for userId: {}", userId);
        }
 
        KycDocument saved = kycRepository.save(kyc);
        log.info("Step 2 completed for userId: {}", userId);
 
        return kycMapper.toResponseDto(saved);
    }
 
    // =========================================================
    //  STEP 3 — Upload video for face verification
    // =========================================================
 
    @Override
    @Transactional
    public KycResponseDto submitKycVideo(MultipartFile videoFile, Long userId) {
 
        log.info("Step 3 — Submitting KYC video for userId: {}", userId);
 
        // Validate: Steps 1 & 2 must be done
        KycDocument kyc = kycRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No KYC record found. Please complete Step 1 (info) and Step 2 (documents) first."));
 
        if (!kyc.isInfoSubmitted()) {
            throw new IllegalStateException("Please complete Step 1 (KYC info) first.");
        }
        if (!kyc.isDocumentsSubmitted()) {
            throw new IllegalStateException("Please complete Step 2 (document upload) before uploading video.");
        }
 
        guardAgainstFinalStatus(kyc);
 
        // Validate file
        if (videoFile == null || videoFile.isEmpty()) {
            throw new IllegalArgumentException("Video file is required.");
        }
 
        String contentType = videoFile.getContentType();
        if (contentType == null || !ALLOWED_VIDEO_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Invalid video format. Accepted formats: MP4, MOV, AVI, WEBM.");
        }
 
        // 100 MB size guard
        long maxVideoSizeBytes = 100L * 1024 * 1024;
        if (videoFile.getSize() > maxVideoSizeBytes) {
            throw new IllegalArgumentException("Video file must not exceed 100 MB.");
        }
 
        // Save file
        String fileName = userId + "_video_" + System.currentTimeMillis() + "_" + sanitize(videoFile.getOriginalFilename());
        Path savedPath = saveFile("uploads/kyc/videos/", fileName, videoFile);
 
        kyc.setVideoPath(savedPath.toString());
        kyc.setVideoSubmitted(true);
 
        // Auto-advance: all 3 steps done → SUBMITTED
        if (kyc.isInfoSubmitted() && kyc.isDocumentsSubmitted() && kyc.isVideoSubmitted()) {
            kyc.setKycStatus(KycStatus.SUBMITTED);
            log.info("All 3 KYC steps completed — status set to SUBMITTED for userId: {}", userId);
        }
 
        KycDocument saved = kycRepository.save(kyc);
        log.info("Step 3 completed for userId: {}", userId);
 
        return kycMapper.toResponseDto(saved);
    }
 
    // =========================================================
    //  USER — Delete / Cancel KYC
    // =========================================================
 
    @Override
    @Transactional
    public void deleteKyc(Long userId) {
 
        log.info("Cancelling KYC for userId: {}", userId);
 
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
 
        KycDocument kyc = kycRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No KYC found for userId: " + userId));
 
        if (kyc.getKycStatus() == KycStatus.VERIFIED) {
            throw new IllegalStateException("Cannot cancel a VERIFIED KYC. Contact support.");
        }
 
        user.setKycDocument(null);
        userRepository.saveAndFlush(user);
        kycRepository.delete(kyc);
 
        log.info("KYC cancelled successfully for userId: {}", userId);
    }
 
    // =========================================================
    //  USER — Get KYC Status
    // =========================================================
 
    @Override
    @Transactional(readOnly = true)
    public KycResponseDto getKycByUserId(Long userId) {
 
        log.info("Fetching KYC status for userId: {}", userId);
 
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
 
        return kycRepository.findByUser_UserId(userId)
                .map(kycMapper::toResponseDto)
                .orElse(null);
    }
 
    // =========================================================
    //  ADMIN — Pending List
    // =========================================================
 
    @Override
    @Transactional(readOnly = true)
    public List<KycResponseDto> getPendingKyc() {
 
        log.info("Fetching all SUBMITTED KYC for admin review");
 
        return kycRepository.findByKycStatus(KycStatus.SUBMITTED)
                .stream()
                .map(kycMapper::toResponseDto)
                .toList();
    }
 
    // =========================================================
    //  ADMIN — Approve
    // =========================================================
 
    @Override
    @Transactional
    public String approveKyc(Long kycId) {
 
        log.info("Approving KYC id: {}", kycId);
 
        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new ResourceNotFoundException("KYC not found with id: " + kycId));
 
        if (!kyc.isInfoSubmitted() || !kyc.isDocumentsSubmitted() || !kyc.isVideoSubmitted()) {
            throw new IllegalStateException("Cannot approve KYC — user has not completed all 3 steps.");
        }
 
        kyc.setKycStatus(KycStatus.VERIFIED);
        kycRepository.save(kyc);
 
        return "KYC Approved Successfully";
    }
 
    // =========================================================
    //  ADMIN — Reject
    // =========================================================
 
    @Override
    @Transactional
    public String rejectKyc(Long kycId) {
 
        log.info("Rejecting KYC id: {}", kycId);
 
        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new ResourceNotFoundException("KYC not found with id: " + kycId));
 
        kyc.setKycStatus(KycStatus.REJECTED);
        kycRepository.save(kyc);
 
        return "KYC Rejected Successfully";
    }
 
    // =========================================================
    //  PRIVATE HELPERS
    // =========================================================
 
    /**
     * Saves a MultipartFile to the given directory and returns the saved path.
     */
    private Path saveFile(String directory, String fileName, MultipartFile file) {
        Path filePath = Paths.get(directory, fileName);
        try {
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            log.error("Failed to save file: {}", filePath, e);
            throw new RuntimeException("Failed to store file: " + fileName, e);
        }
        return filePath;
    }
 
    /**
     * Blocks modifications when KYC is in a terminal state.
     */
    private void guardAgainstFinalStatus(KycDocument kyc) {
        if (kyc.getKycStatus() == KycStatus.VERIFIED) {
            throw new IllegalStateException("KYC is already VERIFIED. Contact support.");
        }
        if (kyc.getKycStatus() == KycStatus.SUBMITTED) {
            throw new IllegalStateException("KYC is already SUBMITTED and under review. Cancel first to resubmit.");
        }
    }
 
    /**
     * Strips path separators and null chars from original filenames to prevent path traversal.
     */
    private String sanitize(String originalFilename) {
        if (originalFilename == null) return "unknown";
        return originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
  
}
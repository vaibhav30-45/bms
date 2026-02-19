# 📘 Standard Operating Procedure (SOP)
## How to Work on Issues - Bank Management System

**Repository:** https://github.com/AnishJaiswal4444/bank-management-system  
**Version:** 1.0  
**Created by:** Anish Jaiswal (Project Lead)  
**Approved by:** Vaibhav Shrivastava (Project Manager)  
**Last Updated:** February 15, 2026

---

## 🎯 Overview

This SOP defines the **step-by-step process** every engineer must follow when working on any feature, bug fix, or task in the Bank Management System project.

**Purpose:**
- Maintain code quality
- Prevent merge conflicts
- Enable proper code review
- Track progress effectively
- Ensure team collaboration

**Who follows this:** ALL team members (Frontend + Backend)

**Mandatory Compliance:** No exceptions. All code must follow this workflow.

---

## 📋 Complete Workflow

---

## PHASE 1: Create Issue on GitHub

### Step 1.1: Navigate to GitHub Issues

1. Go to: https://github.com/AnishJaiswal4444/bank-management-system/issues
2. Click **"New Issue"** button (green button, top right)

---

### Step 1.2: Fill Issue Details

**Title Format:**
```
[TYPE] Brief description

Examples:
✅ [FEATURE] Add common exception handler classes
✅ [FEATURE] Implement user registration API
✅ [BUG] Fix duplicate email validation
✅ [ENHANCEMENT] Improve password validation regex
✅ [DOCS] Update API documentation
```

**Description Template:**

```markdown
## Description
Brief description of what needs to be done.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Details
Files to create/modify:
- `path/to/file1.java`
- `path/to/file2.java`

## Dependencies
- Depends on issue #XX (if applicable)
- Blocks issue #YY (if applicable)

## Estimated Effort
Small (< 4 hours) / Medium (1-2 days) / Large (> 2 days)

## Additional Context
Any screenshots, references, or additional information.
```

**Example Issue:**

```markdown
## Description
Create shared/common classes that will be used across all modules (User, Branch, Account, Transaction).

## Acceptance Criteria
- [ ] Create BaseEntity.java with audit fields
- [ ] Create GlobalExceptionHandler.java
- [ ] Create all custom exception classes
- [ ] Create ApiResponse.java wrapper
- [ ] Create Constants.java with all constants
- [ ] Create all Enums (UserStatus, AccountStatus, etc.)
- [ ] Create SecurityConfig.java
- [ ] Update application.properties
- [ ] All classes compile without errors
- [ ] Code follows naming conventions

## Technical Details
Files to create:
- `entity/BaseEntity.java`
- `exception/GlobalExceptionHandler.java`
- `exception/ResourceNotFoundException.java`
- `exception/BadRequestException.java`
- `exception/DuplicateResourceException.java`
- `dto/response/ApiResponse.java`
- `config/SecurityConfig.java`
- `util/Constants.java`
- `enums/UserStatus.java`
- `enums/AccountStatus.java`
- `enums/TransactionType.java`

## Dependencies
None - This is foundational work

## Estimated Effort
Medium (1 day)
```

---

### Step 1.3: Assign Labels

**Select ALL applicable labels:**

| Label | When to Use |
|-------|-------------|
| `backend` | Any backend work (Java/Spring Boot) |
| `frontend` | Any frontend work (React) |
| `feature` | New feature development |
| `bug` | Something is broken |
| `enhancement` | Improving existing feature |
| `documentation` | Documentation changes |
| `testing` | Writing/fixing tests |
| `high-priority` | Urgent, blocking other work |
| `medium-priority` | Important but not urgent |
| `low-priority` | Nice to have |
| `good-first-issue` | Good for beginners |

**Example:** For common classes → `backend`, `feature`, `high-priority`

---

### Step 1.4: Set Assignee

- Assign to yourself if you're working on it
- OR assign to specific team member
- OR leave unassigned for someone to pick up

---

### Step 1.5: Set Milestone (if applicable)

```
Available Milestones:
- Phase 1: Core Setup
- Phase 2: User Authentication
- Phase 3: Account Management
- Phase 4: Transactions
```

---

### Step 1.6: Create Issue

Click **"Submit new issue"**

✅ **Issue created!** Note the issue number (e.g., #12)

---

## PHASE 2: Create Feature Branch

### Step 2.1: Open the Issue

1. Go to the issue you created
2. Look for **"Development"** section on right sidebar
3. Click **"Create a branch"**

---

### Step 2.2: Configure Branch

```
Branch name: Auto-generated or custom (e.g., feature/common-classes)
Branch source: develop ⚠️ ALWAYS use 'develop' as base!
Repository: AnishJaiswal4444/bank-management-system
```

Click **"Create branch"**

✅ **Branch created on GitHub!**

---

## PHASE 3: Checkout Branch Locally

### Step 3.1: Sync with Remote

```bash
# Ensure you're on develop
git checkout develop

# Get latest changes
git pull origin develop
```

---

### Step 3.2: Fetch New Branch

```bash
# Fetch all remote branches
git fetch origin

# List all branches
git branch -a
```

You should see your new branch in the list.

---

### Step 3.3: Checkout Feature Branch

```bash
# Checkout your branch
git checkout [your-branch-name]

# Example:
git checkout 12-feature-add-common-exception-handler

# Verify you're on the correct branch
git branch
```

✅ **You're now on your feature branch!**

---

## PHASE 4: Implement the Feature

### Step 4.1: Make Your Changes

1. Open IntelliJ IDEA
2. Create/modify files as per issue requirements
3. Follow coding standards
4. Add comments for complex logic
5. Test your code locally

---

### Step 4.2: Test Your Code

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Run tests
mvn test
```

⚠️ **Fix all errors before proceeding!**

---

## PHASE 5: Commit Your Changes

### Step 5.1: Check What Changed

```bash
# See modified files
git status

# See actual changes
git diff
```

---

### Step 5.2: Stage Your Changes

```bash
# Stage all changes
git add .

# OR stage specific files
git add src/main/java/.../exception/GlobalExceptionHandler.java
```

---

### Step 5.3: Commit with Proper Message

**Commit Message Format:**
```
<type>: <short description>

<optional detailed description>

Closes #<issue-number>
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Good Examples:**

```bash
git commit -m "feat: add global exception handler

- Created GlobalExceptionHandler with @RestControllerAdvice
- Added exception classes for common errors
- Standardized error responses across all endpoints

Closes #12"

git commit -m "feat: create shared BaseEntity with audit fields

Closes #12"
```

**Bad Examples (DON'T do this):**

```bash
git commit -m "changes" ❌
git commit -m "updated files" ❌
git commit -m "fixed stuff" ❌
```

---

## PHASE 6: Sync with Develop (CRITICAL!)

⚠️ **NEVER SKIP THIS STEP!**

### Step 6.1: Pull Latest Develop

```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Switch back to your branch
git checkout [your-branch-name]

# Merge develop into your branch
git merge develop
```

---

### Step 6.2: Resolve Conflicts (if any)

**If you see conflicts:**

```bash
# Git shows conflicted files
git status

# Open conflicted files in IntelliJ
# Look for conflict markers:
<<<<<<< HEAD
Your changes
=======
Changes from develop
>>>>>>> develop

# Keep the correct code, remove markers
# Save the file

# Mark as resolved
git add <conflicted-file>

# Complete the merge
git commit -m "chore: resolve merge conflicts with develop"
```

**If you can't resolve conflicts:**
1. Ask in team chat with screenshot
2. Tag @AnishJaiswal4444
3. **Never use** `git push -f` (force push) ⚠️

---

### Step 6.3: Test Again After Merge

```bash
# CRITICAL: Test after merging!
mvn clean install
mvn spring-boot:run
```

**Only proceed if everything works!**

---

## PHASE 7: Push to GitHub

```bash
# First time pushing this branch
git push -u origin [your-branch-name]

# Subsequent pushes
git push
```

✅ **Code pushed to GitHub!**

---

## PHASE 8: Create Pull Request

### Step 8.1: Navigate to GitHub

1. Go to: https://github.com/AnishJaiswal4444/bank-management-system
2. You'll see a yellow banner about recent pushes
3. Click **"Compare & pull request"** (green button)

---

### Step 8.2: Configure PR

**Base Settings:**
```
base: develop  ⚠️ MUST be 'develop'
compare: [your-branch-name]
```

**PR Title:**
```
Use same format as commit message

Example: feat: Add common exception handler classes
```

---

### Step 8.3: Fill PR Description

**Use this template:**

```markdown
## Description
Brief description of changes made.

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Code refactoring

## Checklist
- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex code
- [x] Unit tests added/updated (if applicable)
- [x] All tests passing
- [x] Documentation updated (if needed)
- [x] No merge conflicts with develop
- [x] Code compiles without errors

## Related Issue
Closes #[issue-number]

## Changes Made
- List of specific changes
- Another change
- One more change

## Testing Done
- [x] Application starts without errors
- [x] All existing tests pass
- [x] Manually tested [feature/fix]

## Screenshots (if applicable)
[Add screenshots here]

## Additional Notes
Any important information for reviewers.

---

@AnishJaiswal4444 - Please review when you have time. Thanks! 🙏
```

---

### Step 8.4: Assign Reviewer

**Mandatory Reviewer:**
- ✅ Anish Jaiswal (@AnishJaiswal4444)

**Optional Reviewers:**
- Vaibhav Shrivastava (Project Manager)
- Other senior developers

---

### Step 8.5: Add Labels

Use same labels as the issue:
- `backend` / `frontend`
- `feature` / `bug` / `enhancement`
- Priority level

---

### Step 8.6: Link Issue

In right sidebar:
```
Development → Linked Issues → Select #[issue-number]
```

This will **automatically close** the issue when PR is merged!

---

### Step 8.7: Create Pull Request

Click **"Create pull request"**

✅ **PR created!**

---

## PHASE 9: Code Review Process

### Step 9.1: Wait for Review

**Timeline:** Within 24 hours

**Anish will:**
- Review code quality
- Check for issues
- Add comments/suggestions
- Request changes OR approve

---

### Step 9.2: Address Feedback

**If changes requested:**

```bash
# Make changes in your branch
# Edit files as per feedback
# Test changes

# Commit
git add .
git commit -m "fix: address code review feedback

- Fixed method naming as suggested
- Added missing validation
- Updated comments"

# Push (updates PR automatically!)
git push
```

**Notify reviewer:**
```
@AnishJaiswal4444 Fixed all review comments. Ready for re-review!
```

---

### Step 9.3: Approval

When approved:
- ✅ Green checkmark appears
- ✅ "Merge pull request" button enabled

---

## PHASE 10: Merge & Cleanup

### Step 10.1: Merge PR

⚠️ **Only merge after Anish's approval!**

```
1. Click "Merge pull request"
2. Merge method: "Squash and merge" (recommended)
3. Confirm merge
4. Check "Delete branch" checkbox
5. Confirm deletion
```

✅ **Merged to develop!**

---

### Step 10.2: Local Cleanup

```bash
# Switch to develop
git checkout develop

# Pull merged changes
git pull origin develop

# Verify changes are in develop
git log --oneline

# Delete local feature branch
git branch -d [your-branch-name]

# Verify deletion
git branch
```

✅ **Cleanup complete!**

---

### Step 10.3: Verify Issue Closed

1. Go to the original issue
2. Should show **"Closed"** (purple badge)
3. Should reference which PR closed it

✅ **Issue automatically closed!**

---

## 🚨 Common Mistakes to Avoid

| Mistake | Problem | Solution |
|---------|---------|----------|
| Creating branch from `main` | Won't have latest code | Always use `develop` as base |
| Not pulling develop before push | Causes merge conflicts | Always `git merge develop` before push |
| Pushing directly to develop | Bypasses code review | Always create PR |
| Poor commit messages | Can't track changes | Use conventional commits format |
| Not testing after merge | May break develop | Always test after merging develop |
| Force pushing (`git push -f`) | Loses team's work | **NEVER** force push |
| Working on develop directly | Breaks shared branch | Always create feature branch |
| Not linking issue to PR | Issue stays open | Use "Closes #XX" in PR description |
| Skipping code review | Poor code quality | Wait for Anish's approval |
| Large commits | Hard to review | Make small, focused commits |

---

## 📊 Quick Reference Flowchart

```
┌──────────────────────┐
│  1. Create Issue     │
│     on GitHub        │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  2. Create Branch    │
│     from Issue       │
│     (base: develop)  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  3. Checkout Branch  │
│     Locally          │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  4. Make Changes     │
│     + Test           │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  5. Commit Changes   │
│     (good message)   │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  6. Merge develop    │ ⚠️ CRITICAL STEP
│     into branch      │
│  (resolve conflicts) │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  7. Test Again       │ ⚠️ IMPORTANT
│     (after merge)    │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  8. Push to GitHub   │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  9. Create PR        │
│  (develop ← branch)  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ 10. Code Review      │
│     by Anish         │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ 11. Address Feedback │
│     (if any)         │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ 12. Merge PR         │
│     + Delete Branch  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ 13. Pull develop     │
│     + Local Cleanup  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  ✅ COMPLETE!        │
│  Issue Closed        │
└──────────────────────┘
```

---

## ✅ Checklist (Print & Keep)

**Before starting work:**
- [ ] Created issue on GitHub
- [ ] Added proper labels
- [ ] Set assignee
- [ ] Set milestone (if applicable)

**During development:**
- [ ] Created branch from issue (base: develop)
- [ ] Checked out branch locally
- [ ] Made changes
- [ ] Tested locally (`mvn clean install`)
- [ ] Committed with good message

**Before pushing:**
- [ ] Merged develop into branch
- [ ] Resolved conflicts (if any)
- [ ] Tested again after merge
- [ ] Pushed to GitHub

**Pull Request:**
- [ ] Created PR (develop ← feature-branch)
- [ ] Filled PR template completely
- [ ] Assigned Anish as reviewer
- [ ] Added labels
- [ ] Linked issue to PR

**After approval:**
- [ ] PR approved by Anish
- [ ] Merged PR
- [ ] Deleted remote branch
- [ ] Pulled develop locally
- [ ] Deleted local branch
- [ ] Verified issue closed

---

## 📞 Getting Help

**If you're stuck:**

1. **Check documentation first**
   - This SOP
   - README.md
   - Team setup guide

2. **Search existing issues**
   - Someone may have faced same problem

3. **Ask in team chat**
   - Provide context
   - Share error messages
   - Include screenshots

4. **Tag the right person**
   - Technical questions → @AnishJaiswal4444
   - Project questions → @VaibhavShrivastava

**When asking for help:**

✅ Good question:
```
I'm working on issue #12 (common classes) and getting this error when running mvn clean install:

[ERROR] ... (paste error)

I've tried:
1. Cleaning and rebuilding
2. Checking dependencies in pom.xml

Can someone help?
```

❌ Bad question:
```
It's not working. Help!
```

---

## 🎯 Best Practices

1. **Keep branches focused**
   - One branch = One feature/fix
   - Don't mix unrelated changes

2. **Commit frequently**
   - Small, logical commits
   - Better for code review
   - Easier to rollback if needed

3. **Write good commit messages**
   - Clear and descriptive
   - Use conventional commits format
   - Reference issue number

4. **Test thoroughly**
   - Before committing
   - After merging develop
   - Don't push broken code

5. **Communicate**
   - Update team on progress
   - Ask questions early
   - Report blockers immediately

6. **Review others' code**
   - Learn from teammates
   - Provide constructive feedback
   - Be respectful

7. **Keep pull requests small**
   - Easier to review
   - Faster to merge
   - Less likely to have conflicts

8. **Stay updated**
   - Pull develop frequently
   - Check for new issues
   - Read team announcements

---

## 📚 Resources

- **Repository:** https://github.com/AnishJaiswal4444/bank-management-system
- **Issues:** https://github.com/AnishJaiswal4444/bank-management-system/issues
- **Pull Requests:** https://github.com/AnishJaiswal4444/bank-management-system/pulls
- **Git Documentation:** https://git-scm.com/doc
- **Conventional Commits:** https://www.conventionalcommits.org/

---

## 📝 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 15, 2026 | Initial SOP created | Anish Jaiswal |

---

## ✍️ Acknowledgments

Created by: **Anish Jaiswal** (Project Lead)  
Approved by: **Vaibhav Shrivastava** (Project Manager)

---

**Questions or suggestions for improving this SOP?**  
Create an issue with label `documentation` or message in team chat.

---

*Last updated: February 15, 2026*

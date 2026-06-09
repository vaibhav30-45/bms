import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Home,
  Building,
  CheckCircle2,
} from "lucide-react";
import {
  getAddresses,
  createAddress,
  updateAddress,
} from "../../../api/addressApi";
import { addressSchema } from "../../../utils/validators";
import { getErrorMessage } from "../../../utils/helpers";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Alert from "../../../components/common/Alert";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import Modal from "../../../components/common/Modal";


// Address Form (used inside modal)
function AddressForm({ defaultValues, onSubmit, onCancel, loading, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Alert type="error" message={error} show={!!error} className="mb-1" />

      <Input
        label="Address Line"
        name="address"
        placeholder="123 MG Road, Sector 5"
        required
        prefix={<MapPin size={15} />}
        error={errors.address?.message}
        {...register("address")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          placeholder="Mumbai"
          required
          prefix={<Building size={15} />}
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="State"
          name="state"
          placeholder="Maharashtra"
          required
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      <Input
        label="Pincode"
        name="pincode"
        placeholder="400001"
        required
        error={errors.pincode?.message}
        hint="Exactly 6 digits"
        {...register("pincode")}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <Button
          type="submit"
          size="md"
          loading={loading}
          disabled={defaultValues && !isDirty}
          className="sm:flex-1"
        >
          <Save size={15} />
          {defaultValues ? "Update Address" : "Save Address"}
        </Button>
        <Button
          type="button"
          size="md"
          variant="outline"
          onClick={onCancel}
          className="sm:flex-1"
        >
          <X size={15} />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Address Card
function AddressCard({ address, onEdit, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border
                 border-gray-100 dark:border-gray-800 p-5
                 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl bg-[#1a3c5e]/8
                          dark:bg-blue-400/10 flex items-center
                          justify-center flex-shrink-0"
          >
            <Home size={18} className="text-[#1a3c5e] dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p
                className="text-xs font-bold text-gray-400
                            uppercase tracking-wide"
              >
                Address {index + 1}
              </p>
              <div
                className="flex items-center gap-1 px-2 py-0.5
                              rounded-full bg-emerald-50 dark:bg-emerald-900/20"
              >
                <CheckCircle2 size={10} className="text-emerald-500" />
                <span
                  className="text-[10px] font-bold text-emerald-600
                                 dark:text-emerald-400"
                >
                  Active
                </span>
              </div>
            </div>
            <p
              className="text-sm font-semibold text-gray-900
                          dark:text-white break-words leading-snug"
            >
              {address.address}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {[address.city, address.state, address.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>

        <button
          onClick={() => onEdit(address)}
          className="p-2 rounded-xl text-gray-400 hover:text-[#1a3c5e]
                     dark:hover:text-blue-400 hover:bg-gray-100
                     dark:hover:bg-gray-800 transition-all flex-shrink-0"
          aria-label="Edit address"
        >
          <Edit3 size={15} />
        </button>
      </div>
    </motion.div>
  );
}


// Main Address Page
export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      const list = res.data?.data ?? res.data ?? [];
      setAddresses(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAdd = () => {
    setEditAddress(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditAddress(addr);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditAddress(null);
    setFormError("");
  };

  const handleCreate = async (data) => {
    try {
      setFormLoading(true);
      setFormError("");
      await createAddress(data);
      toast.success("Address added successfully!");
      closeModal();
      fetchAddresses();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setFormLoading(true);
      setFormError("");
      await updateAddress(editAddress.addressId, data);
      toast.success("Address updated successfully!");
      closeModal();
      fetchAddresses();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Addresses — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6 max-w-3xl">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3"
        >
          <div>
            <h1
              className="text-xl sm:text-2xl font-black text-gray-900
                           dark:text-white"
            >
              My Addresses
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your saved addresses
            </p>
          </div>
          <Button size="md" onClick={openAdd}>
            <Plus size={16} />
            Add Address
          </Button>
        </div>

        {/* Info card */}
        <div
          className="flex items-start gap-3 p-4 rounded-2xl
                        bg-blue-50 dark:bg-blue-900/20
                        border border-blue-200 dark:border-blue-800"
        >
          <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            These addresses are separate from your KYC address. They can be used
            for correspondence and account management.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" text="Loading addresses..." />
          </div>
        ) : addresses.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={MapPin}
              title="No addresses saved"
              description="Add your home or office address for easier account management."
              actionLabel="Add Address"
              onAction={openAdd}
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {addresses.map((addr, i) => (
              <AddressCard
                key={addr.addressId}
                address={addr}
                onEdit={openEdit}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editAddress ? "Edit Address" : "Add New Address"}
        size="md"
      >
        <AddressForm
          defaultValues={
            editAddress
              ? {
                  address: editAddress.address,
                  city: editAddress.city,
                  state: editAddress.state,
                  pincode: editAddress.pincode,
                }
              : undefined
          }
          onSubmit={editAddress ? handleUpdate : handleCreate}
          onCancel={closeModal}
          loading={formLoading}
          error={formError}
        />
      </Modal>
    </>
  );
}

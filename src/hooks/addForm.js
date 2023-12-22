// useFormModal.js
import { useState, useEffect } from "react";

const AddFormModal = (fields, initialData, onSubmit) => {
  const initialFormData = {};
  const initialErrors = {};

  fields.forEach((field) => {
    initialFormData[field.name] = field.isMultiSelect ? [] : "";
    initialErrors[field.name] = "";
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateFormData = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      } else {
        newErrors[field.name] = "";
      }
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (fieldName, fieldType) => (event, newValue) => {
    if (Array.isArray(newValue)) {
      setFormData({ ...formData, [fieldName]: newValue });
    } else if (fieldType === "file") {
      const file = event.target.files[0];
      setFormData({ ...formData, [fieldName]: file });
    } else {
      setFormData({ ...formData, [fieldName]: event.target.value });
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    const clearedFormData = {};
    fields.forEach((field) => {
      clearedFormData[field.name] = field.isMultiSelect ? [] : "";
    });
    setFormData(clearedFormData);
    setErrors(initialErrors);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (validateFormData()) {
      onSubmit(formData);
      closeModal();
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    handleSubmit,
    formData,
    errors,
    handleChange,
  };
};

export default AddFormModal;

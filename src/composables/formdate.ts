const useFormData = (data: Object | Array<any>) : FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

export default useFormData;
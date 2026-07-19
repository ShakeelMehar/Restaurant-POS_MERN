import React from "react";

const PhoneInput = ({ 
  value, 
  onChange, 
  name = "phone", 
  placeholder = "03XX-XXXXXXX", 
  required = false, 
  className = "input-base" 
}) => {
  const handleInputChange = (e) => {
    let val = e.target.value.replace(/^\+92/, "0").replace(/\D/g, "");
    
    // Formatting logic
    if (val.length > 0 && val[0] !== "0") val = "0" + val;
    if (val.length > 1 && val[1] !== "3") val = "03" + val.substring(2);
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 4) val = val.substring(0, 4) + "-" + val.substring(4);
    
    // Simulate standard event object to keep compatibility with existing generic handlers
    onChange({
      target: {
        name,
        value: val
      }
    });
  };

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={className}
      required={required}
    />
  );
};

export default PhoneInput;

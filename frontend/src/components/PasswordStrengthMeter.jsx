import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
   
    // const criteria = [
	// 	{ label: "At least 6 characters", met: password.length >= 6 },
	// 	{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
	// 	{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
	// 	{ label: "Contains a number", met: /\d/.test(password) },
		// { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	// ];

  const criteria = [
    { label: "Atleat 6 characters", condition: password.length >= 6 },
    {label: "At least one uppercase letter", condition: /[A-Z]/.test(password)},
    {label: "At least one lowercase letter", condition: /[a-z]/.test(password)},
    {label: "At least one number", condition:  /\d/.test(password)},
	{ label: "At least one special character", condition: /[^A-Za-z0-9]/.test(password) },
    // {label: "At least one special character (!@#$%^&*)", condition: /[!@#$%^&*]/.test(password)},
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.condition ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={item.condition ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  // Implement password strength meter logic here. For example, using a library like zxcvbn.
  const getStrength = (pass) => {
    let strength = 0;
    // Check length and character types
    if (pass.length >= 6) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;
    return strength;
  };
  // Return the strength meter component with the strength value
  const strength = getStrength(password);

  const getColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-600";
      default:
        return "bg-green-600";
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "Very Strong";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
        ${index < strength ? getColor(strength) : "bg-gray-600"}
      `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;

import { createContext, useContext, useState } from "react";

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <AccountContext.Provider
      value={{ accounts, setAccounts, selectedAccount, setSelectedAccount }}
    >
      {children}
    </AccountContext.Provider>
  );
};
export const useAccounts = () => useContext(AccountContext);

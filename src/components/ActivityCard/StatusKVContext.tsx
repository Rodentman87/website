import React from "react";

export const StatusKVContext = React.createContext<Record<string, string>>({});

export const StatusKVProvider: React.FC<{
	kv: Record<string, string>;
	children: React.ReactNode;
}> = ({ kv, children }) => {
	return (
		<StatusKVContext.Provider value={kv}>{children}</StatusKVContext.Provider>
	);
};

export const useStatusKV = () => React.useContext(StatusKVContext);

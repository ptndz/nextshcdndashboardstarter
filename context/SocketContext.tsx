'use client';
import { useSession } from 'next-auth/react';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import socketIOClient, { Socket } from 'socket.io-client';

export interface ConfirmProviderProps {
  socket: Socket | undefined;
}

const SocketContext = createContext({} as ConfirmProviderProps);

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  const { data: session } = useSession();
  useEffect(() => {
    const socketClient = socketIOClient(
      process.env.NEXT_PUBLIC_BASE_URL_SOCKET as string,
      {
        auth: { token: session?.accessToken }
      }
    );
    setSocket(socketClient);
    return () => {
      socketClient.disconnect();
    };
  }, [session?.accessToken]);

  const value = { socket };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}

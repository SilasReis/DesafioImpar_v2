import toast from 'react-hot-toast';

export const toastSuccess = (message: string, duration: number = 3000) => {
  toast.success(message, {
    duration,
    style: {
      background: '#4caf50',
      color: '#fff',
      fontFamily: "sans-serif",
      fontSize:"18px",
      width: "35vh"
    },
  });
};

export const toastError = (message: string, duration: number = 3000) => {
  toast.error(message, {
    duration,
    style: {
      background: '#f44336',
      color: '#fff',
      fontFamily: "sans-serif",
      fontSize:"18px",
      width: "35vh"
    },
  });
};

export const toastInfo = (message: string, duration: number = 3000) => {
  toast(message, {
    duration,
    style: {
      background: '#2196f3',
      color: '#fff',
      fontFamily: "sans-serif",
      fontSize:"18px",
      width: "35vh"
    },
  });
};

export const toastWarning = (message: string, duration: number = 3000) => {
  toast(message, {
    duration,
    style: {
      background: '#ff9800',
      color: '#fff',
      fontFamily: "sans-serif",
      fontSize:"18px",
      width: "35vh"
    },
    icon: '⚠️',
  });
};


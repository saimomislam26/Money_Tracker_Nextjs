interface ErrorMessageProps {
    message: string;
  }
  
  export default function ErrorMessage({ message }: ErrorMessageProps) {
    return <div className="text-red-600">{message}</div>;
  }
export function Toast({ title, description, status = 'info' }) {
    const statusStyles = {
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
    };
  
    return (
      <div className={`p-4 mb-2 rounded-md ${statusStyles[status]}`}>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    );
  }
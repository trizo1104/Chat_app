type AuthImage = { title: string; subtitle: string };

const AuthImagePattern = ({ title, subtitle }: AuthImage) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gray-100 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${
                i % 2 === 0 ? "bg-purple-400 animate-pulse" : "bg-purple-200"
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

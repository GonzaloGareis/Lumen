const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-[#ffffff] overflow-auto">
      <div className="h-full w-full">{children}</div>
    </main>
  );
};

export default LandingLayout;

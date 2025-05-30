function Footer() {
  return (
    <footer className="bg-light text-black text-center py-3 mt-auto" style={{
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
      }}> 
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} <strong>Splitify™</strong>. All
          rights reserved.
        </p>
        <small>Made with 🧠, ☕ and probably a few bugs 🐛</small>
      </div>
    </footer>
  );
}

export default Footer;

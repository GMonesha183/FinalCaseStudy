export default function Footer(){
  return (
    <footer style={{
      marginTop:40, borderTop:"1px solid var(--line)", background:"#fff"
    }}>
      <div className="container" style={{padding:"20px 0", color:"var(--muted)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12}}>
        <div>© {new Date().getFullYear()} SnuggleInn</div>
        <div style={{display:"flex", gap:16}}>
          <a href="#!">Privacy</a>
          <a href="#!">Terms</a>
          <a href="#!">Support</a>
        </div>
      </div>
    </footer>
  );
}

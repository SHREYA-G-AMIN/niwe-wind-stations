import wmsReference from "../../assets/LIST_OF_WMS_AS_ON_31072026.pdf";

function Footer() {
    return (
         <div
  style={{
    textAlign: "center",
    padding: "1.25rem",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  }}
>
  <p
    style={{
      margin: 0,
      fontWeight: 600,
      color: "var(--text-h)",
    }}
  >
    Reference Resources
  </p>

  <p style={{ margin: "0.75rem 0 0" }}>
    <a
      href={wmsReference}
      target="_blank"
      rel="noreferrer"
      style={{ color: "var(--text-h)" }}
    >
      LIST_OF_WMS_AS_ON_31072026
    </a>
  </p>

  <p style={{ margin: "0.75rem 0 0" }}>
    NIWE Wind Resource Maps:{" "}
    <a
      href="https://maps.niwe.res.in/resource_map/map/150m/"
      target="_blank"
      rel="noreferrer"
      style={{ color: "var(--text-h)" }}
    >
      150 m
    </a>
    {" | "}
    <a
      href="https://maps.niwe.res.in/resource_map/map/120m/"
      target="_blank"
      rel="noreferrer"
      style={{ color: "var(--text-h)" }}
    >
      120 m
    </a>
  </p>
</div>
    )
}

export default Footer;
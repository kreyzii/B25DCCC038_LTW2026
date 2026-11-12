const Supports = ({
  status,
  usedPreview,
  usedInsurance,
  usedHint,
  onPreview,
  onInsure,
  onHint,
}) => (
  <div style={{ margin: "12px 0" }}>
    <button disabled={usedPreview || status !== "betting"} onClick={onPreview}>
      Xem trước
    </button>{" "}
    <button disabled={usedInsurance || status === "revealed"} onClick={onInsure}>
      {usedInsurance ? "Đã bảo hiểm" : "Bảo hiểm"}
    </button>{" "}
    <button disabled={usedHint || status !== "answering"} onClick={onHint}>
      Gợi ý
    </button>
  </div>
);

export default Supports;
import { useState, useEffect } from "react";
import {
  getExportHistory,
  requestDataExport,
  checkPinRequirement,
  downloadExportFile,
} from "../services/portabilityService";

export default function DataPortability({ onNavigate, onBack, profilePicture, email }) {
  const [format, setFormat] = useState("csv");
  const [exportsList, setExportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [hasPin, setHasPin] = useState(false);

  // Security Check / PIN Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const activeEmail = email || localStorage.getItem("email") || "";
  const userAvatar =
    profilePicture ||
    localStorage.getItem("profilePicture") ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

  // Load real user exports and PIN requirement on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [historyRes, pinRes] = await Promise.allSettled([
          getExportHistory(activeEmail),
          checkPinRequirement(activeEmail),
        ]);

        if (isMounted) {
          if (historyRes.status === "fulfilled" && historyRes.value?.exports) {
            setExportsList(historyRes.value.exports);
          } else {
            setExportsList([]);
          }

          if (pinRes.status === "fulfilled" && pinRes.value?.hasPin !== undefined) {
            setHasPin(pinRes.value.hasPin);
          } else {
            const localHasPin = localStorage.getItem("hasPin") === "true";
            setHasPin(localHasPin);
          }
        }
      } catch (err) {
        console.error("Failed to load export data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeEmail]);

  const goBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("privacy_policy");
  };

  const showToast = (msg) => {
    setDownloadNotice(msg);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // Direct trigger for browser download from string content
  const triggerClientDownload = (content, fileName, mimeType) => {
    try {
      const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Client download failed:", e);
    }
  };

  // Handle clicking row to download existing export
  const handleDownloadExisting = async (record) => {
    try {
      showToast(`Downloading ${record.name}...`);
      await downloadExportFile(record.id, record.name, activeEmail);
    } catch (err) {
      console.error("Failed to download export:", err);
      showToast(`Error downloading file: ${err.message}`);
    }
  };

  // Open PIN verification or execute direct export
  const handleInitiateExport = () => {
    if (hasPin) {
      setPinDigits(["", "", "", ""]);
      setPinError("");
      setShowPinModal(true);
    } else {
      executeExport(null);
    }
  };

  // Execute export API call with or without PIN
  const executeExport = async (pinValue) => {
    setIsExporting(true);
    setPinError("");

    try {
      const res = await requestDataExport(format.toUpperCase(), pinValue, activeEmail);

      if (res && res.success && res.exportRecord) {
        // Add new database record to local state
        setExportsList((prev) => [res.exportRecord, ...prev]);

        // Trigger real file download
        if (res.downloadData) {
          triggerClientDownload(res.downloadData, res.fileName, res.mimeType || "text/plain");
        } else if (res.exportRecord.id) {
          await downloadExportFile(res.exportRecord.id, res.exportRecord.name, activeEmail);
        }

        setShowPinModal(false);
        showToast(`Export generated: ${res.fileName}`);
      } else {
        throw new Error(res?.message || "Failed to generate export");
      }
    } catch (err) {
      console.error("Export request failed:", err);
      if (err.requiresPin || err.message?.toLowerCase().includes("pin")) {
        setPinError(err.message || "Invalid Trade PIN. Please try again.");
      } else {
        setPinError(err.message || "Export failed. Please check your connection.");
        if (!hasPin) {
          showToast(`Error: ${err.message}`);
        }
      }
    } finally {
      setIsExporting(false);
      setIsVerifyingPin(false);
    }
  };

  // Handle PIN Digit changes
  const handlePinChange = (idx, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[idx] = value.slice(-1);
    setPinDigits(newDigits);
    setPinError("");

    // Auto-focus next input
    if (value && idx < 3) {
      const nextInput = document.getElementById(`portability-pin-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !pinDigits[idx] && idx > 0) {
      const prevInput = document.getElementById(`portability-pin-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const pin = pinDigits.join("");
    if (pin.length < 4) {
      setPinError("Please enter your full 4-digit Trade PIN");
      return;
    }
    setIsVerifyingPin(true);
    executeExport(pin);
  };

  return (
    <main className="portability-page" aria-label="Data Portability">
      {/* Toast Notification */}
      {downloadNotice && (
        <div className="portability-toast" role="status" aria-live="polite">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Security Check / Trade PIN Modal */}
      {showPinModal && (
        <div className="portability-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-pin-title">
          <div className="portability-modal-card">
            <div className="portability-modal-head">
              <div className="portability-modal-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00f2fe" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 id="modal-pin-title">Security Check</h2>
              <p>Enter your 4-digit <strong>Trade PIN</strong> to authorize generating and exporting your financial data.</p>
            </div>

            <form onSubmit={handlePinSubmit} className="portability-pin-form">
              <div className="portability-pin-inputs">
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`portability-pin-${idx}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                    className="portability-pin-box"
                    autoFocus={idx === 0}
                    disabled={isVerifyingPin}
                  />
                ))}
              </div>

              {pinError && <div className="portability-pin-error">{pinError}</div>}

              <div className="portability-modal-actions">
                <button
                  type="button"
                  className="portability-modal-btn cancel"
                  onClick={() => setShowPinModal(false)}
                  disabled={isVerifyingPin}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="portability-modal-btn confirm"
                  disabled={isVerifyingPin || pinDigits.some((d) => !d)}
                >
                  {isVerifyingPin ? "Authorizing..." : "Authorize & Export"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="portability-wrapper">
        {/* Top Bar */}
        <header className="portability-topbar">
          <div className="portability-topbar-left">
            <button
              className="portability-back-btn"
              type="button"
              aria-label="Go back"
              onClick={goBack}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="portability-title">Data Portability</h1>
          </div>

          <div
            className="portability-user-profile"
            onClick={() => onNavigate && onNavigate("profile")}
            role="button"
            tabIndex={0}
            aria-label="User profile"
          >
            <img src={userAvatar} alt="User Avatar" className="portability-avatar-img" />
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </header>

        {/* Top Cards Section */}
        <section className="portability-top-section">
          {/* Left Card: Export Your Records */}
          <div className="portability-records-card">
            <div className="portability-records-header">
              <div className="portability-folder-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  <polyline points="14 11 17 14 14 17" />
                  <line x1="9" y1="14" x2="17" y2="14" />
                </svg>
              </div>
              <h2>Export Your Records</h2>
            </div>

            <div className="portability-formats-grid">
              {/* CSV Card */}
              <div
                className={`portability-format-box ${format === "csv" ? "active-glow" : "frosted"}`}
                onClick={() => setFormat("csv")}
                role="button"
                tabIndex={0}
                aria-pressed={format === "csv"}
              >
                <div className="portability-badge-wrap">
                  <span className="portability-badge csv-badge">CSV</span>
                </div>
                <h3 className="portability-format-title">CSV</h3>
                <p className="portability-format-desc">
                  {format === "csv" ? (
                    "Download a comprehensive archive of your MarketPulse AI activity history, credit logs, performance analytics, and profile data in machine-readable formats for external audits or personal backups."
                  ) : (
                    "Spreadsheets & tabular analysis formatted for Excel or Google Sheets."
                  )}
                </p>
              </div>

              {/* JSON Card */}
              <div
                className={`portability-format-box ${format === "json" ? "active-glow" : "frosted"}`}
                onClick={() => setFormat("json")}
                role="button"
                tabIndex={0}
                aria-pressed={format === "json"}
              >
                <div className="portability-badge-wrap">
                  <span className="portability-badge json-badge">{"{ }"}</span>
                </div>
                <h3 className="portability-format-title">JSON</h3>
                <p className="portability-format-desc">
                  {format === "json" ? (
                    "Download complete hierarchical JSON data including product catalog, sales logs, audit trails, and customer metrics for developers and API integrations."
                  ) : (
                    "Standard for developers & APIs"
                  )}
                </p>
              </div>
            </div>

            <div className="portability-action-row">
              <button
                className="portability-request-btn"
                type="button"
                onClick={handleInitiateExport}
                disabled={isExporting}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m8 17 4 4 4-4" />
                </svg>
                <span>{isExporting ? "Generating Export..." : "Request Data Export"}</span>
              </button>
            </div>
          </div>

          {/* Right Security Column */}
          <div className="portability-security-column">
            {/* Security Check Card */}
            <div className="portability-dark-card">
              <div className="portability-icon-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00f2fe" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="portability-security-title">Security Check</h3>
              <p className="portability-security-text">
                For your protection, a valid <strong>Trade PIN</strong> will authorize the data generation process.
              </p>
            </div>

            {/* Secure Archives Card */}
            <div className="portability-dark-card">
              <div className="portability-icon-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00f2fe" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="portability-security-title">Secure Archives</h3>
              <p className="portability-security-text">
                Bank-grade encryption on all exports
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Data Table Section */}
        <section className="portability-table-section" aria-label="Export History Table">
          <div className="portability-table-card">
            <div className="portability-table-scroll">
              <table className="portability-table">
                <thead>
                  <tr className="portability-thead-row">
                    <th className="portability-th th-filename">File Name</th>
                    <th className="portability-th th-type">Type</th>
                    <th className="portability-th th-date">Date</th>
                    <th className="portability-th th-size">Size</th>
                    <th className="portability-th th-status">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="portability-td-empty">
                        Loading your export records...
                      </td>
                    </tr>
                  ) : exportsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="portability-td-empty">
                        No export archives generated yet. Click &quot;Request Data Export&quot; above to create your first archive.
                      </td>
                    </tr>
                  ) : (
                    exportsList.map((row, idx) => {
                      const isEven = idx % 2 === 1;
                      return (
                        <tr
                          key={row.id || idx}
                          className={`portability-tr ${isEven ? "tr-even" : "tr-odd"}`}
                          onClick={() => handleDownloadExisting(row)}
                          title={`Click to download ${row.name}`}
                        >
                          <td className="portability-td td-filename">
                            {row.name}
                          </td>
                          <td className="portability-td td-type">
                            {row.type}
                          </td>
                          <td className="portability-td td-date">
                            {row.date}
                          </td>
                          <td className="portability-td td-size">
                            {row.size}
                          </td>
                          <td className="portability-td td-status">
                            <span className="portability-status-pill">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

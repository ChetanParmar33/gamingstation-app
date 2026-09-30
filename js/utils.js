/* ==========================================================================
   GameZone Business Management — Utilities (js/utils.js)
   Formatting, Badges, Modals, Toasts, CSV Import/Export, Table Helpers
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Utils = {
  /**
   * Format number in Indian Rupee numbering system (e.g. ₹4,85,000)
   */
  formatINR(value, showSymbol = true) {
    const num = Number(value) || 0;
    const isNeg = num < 0;
    const abs = Math.abs(Math.round(num));
    const formatted = abs.toLocaleString('en-IN');
    const symbol = (GZ.Storage && GZ.Storage.getSettings().currencySymbol) || '₹';
    return `${isNeg ? '-' : ''}${showSymbol ? symbol : ''}${formatted}`;
  },

  /**
   * Format ISO date string (YYYY-MM-DD) -> "28 Sep 2026"
   */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Get YYYY-MM key from date string for monthly grouping
   */
  getMonthKey(dateStr) {
    if (!dateStr || dateStr.length < 7) return '2026-09';
    return dateStr.slice(0, 7);
  },

  /**
   * Format YYYY-MM -> "Sep 2026"
   */
  formatMonthLabel(monthKey) {
    const [y, m] = (monthKey || '2026-09').split('-');
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  },

  /**
   * Generate prefixed sequential or unique ID
   */
  generateId(prefix = 'GZ', list = []) {
    let max = 100;
    list.forEach(item => {
      const m = String(item.id || '').match(/(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > max) max = n;
      }
    });
    return `${prefix}-${max + 1}`;
  },

  /**
   * Escape HTML special characters to prevent XSS
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Render status / condition / priority badge HTML
   */
  badge(label) {
    const val = String(label || 'Pending').trim();
    const lower = val.toLowerCase();
    let cls = 'badge-info';
    let icon = 'fa-circle-info';

    if (lower === 'paid' || lower === 'completed' || lower === 'active') {
      cls = 'badge-paid';
      icon = 'fa-circle-check';
    } else if (lower === 'partial') {
      cls = 'badge-partial';
      icon = 'fa-clock-rotate-left';
    } else if (lower === 'pending' || lower === 'cancelled' || lower === 'damaged') {
      cls = 'badge-pending';
      icon = 'fa-circle-exclamation';
    } else if (lower === 'approved' || lower === 'new') {
      cls = 'badge-approved';
      icon = 'fa-star';
    } else if (lower === 'planned' || lower === 'good' || lower === 'low') {
      cls = 'badge-planned';
      icon = 'fa-calendar-check';
    } else if (lower === 'high') {
      cls = 'badge-high';
      icon = 'fa-arrow-up';
    } else if (lower === 'medium' || lower === 'needs repair') {
      cls = 'badge-medium';
      icon = 'fa-screwdriver-wrench';
    }

    if (GZ.I18n) GZ.I18n.scheduleTranslate();
    const displayLabel = GZ.I18n ? GZ.I18n.t(val) : val;
    return `<span class="badge ${cls}"><i class="fa-solid ${icon}"></i> ${this.escapeHtml(displayLabel)}</span>`;
  },

  /**
   * Show Toast Notification
   */
  toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      danger: 'fa-circle-xmark',
      info: 'fa-circle-info'
    };

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info}"></i>
      <span>${this.escapeHtml(GZ.I18n ? GZ.I18n.t(message) : message)}</span>
    `;
    container.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = '0.25s ease';
      setTimeout(() => el.remove(), 250);
    }, 3200);
  },

  /**
   * Open Reusable Modal
   */
  openModal({ title, bodyHtml, footerHtml, size = '', onMount = null }) {
    const backdrop = document.getElementById('globalModalBackdrop');
    const dialog = document.getElementById('globalModalDialog');
    const titleEl = document.getElementById('globalModalTitle');
    const bodyEl = document.getElementById('globalModalBody');
    const footerEl = document.getElementById('globalModalFooter');

    dialog.className = `modal-dialog ${size ? 'modal-' + size : ''}`;
    titleEl.innerHTML = title;
    bodyEl.innerHTML = bodyHtml;

    if (footerHtml !== undefined) {
      footerEl.innerHTML = footerHtml;
      footerEl.classList.remove('hidden');
    } else {
      footerEl.classList.add('hidden');
    }

    backdrop.classList.remove('hidden');
    if (typeof onMount === 'function') onMount(bodyEl, footerEl);
    if (GZ.I18n) GZ.I18n.translateDOM(dialog);
  },

  closeModal() {
    const backdrop = document.getElementById('globalModalBackdrop');
    if (backdrop) backdrop.classList.add('hidden');
  },

  /**
   * Confirmation Modal for Delete / Destructive Actions
   */
  confirmDialog({ title = 'Confirm Action', message, confirmText = 'Delete', confirmClass = 'btn-danger', onConfirm }) {
    this.openModal({
      title: `<i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);margin-right:6px;"></i> ${title}`,
      size: 'sm',
      bodyHtml: `<p style="font-size:0.92rem;color:var(--text-secondary);line-height:1.55;">${message}</p>`,
      footerHtml: `
        <button type="button" class="btn btn-secondary" onclick="GZ.Utils.closeModal()">Cancel</button>
        <button type="button" class="btn ${confirmClass}" id="confirmModalActionBtn">${confirmText}</button>
      `,
      onMount: () => {
        const btn = document.getElementById('confirmModalActionBtn');
        if (btn) {
          btn.onclick = () => {
            this.closeModal();
            if (typeof onConfirm === 'function') onConfirm();
          };
        }
      }
    });
  },

  /**
   * Sort array of objects by key and direction ('asc' | 'desc')
   */
  sortData(list, key, dir = 'asc') {
    const factor = dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      let va = a[key];
      let vb = b[key];

      if (va === undefined || va === null) va = '';
      if (vb === undefined || vb === null) vb = '';

      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * factor;
      }
      const na = Number(va);
      const nb = Number(vb);
      if (!isNaN(na) && !isNaN(nb) && String(va).trim() !== '' && String(vb).trim() !== '') {
        return (na - nb) * factor;
      }
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' }) * factor;
    });
  },

  /**
   * Paginate array and return { items, total, page, totalPages, startIdx, endIdx }
   */
  paginate(list, page = 1, perPage = 8) {
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (safePage - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, total);
    return {
      items: list.slice(startIdx, endIdx),
      total,
      page: safePage,
      totalPages,
      startIdx: total === 0 ? 0 : startIdx + 1,
      endIdx
    };
  },

  /**
   * Render Pagination Controls HTML
   */
  renderPagination(pageInfo, onPageCallbackName) {
    if (GZ.I18n) GZ.I18n.scheduleTranslate();
    const { page, totalPages, startIdx, endIdx, total } = pageInfo;
    let btns = '';
    btns += `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="${onPageCallbackName}(${page - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="${onPageCallbackName}(${i})">${i}</button>`;
    }
    btns += `<button class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="${onPageCallbackName}(${page + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;

    return `
      <div class="pagination-controls">
        <span style="font-size:0.78rem;color:var(--text-muted);margin-right:0.5rem;">
          Showing ${startIdx}–${endIdx} of ${total}
        </span>
        ${btns}
      </div>
    `;
  },

  /**
   * Export Array of Objects to CSV file download
   */
  exportCSV(filename, rows, columns) {
    if (!rows || !rows.length) {
      this.toast('No records available to export.', 'warning');
      return;
    }

    const headers = columns.map(c => c.label);
    const csvLines = [headers.join(',')];

    rows.forEach(row => {
      const vals = columns.map(c => {
        let v = row[c.key];
        if (v === null || v === undefined) v = '';
        const str = String(v).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvLines.push(vals.join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.toast(`Exported ${rows.length} records to ${link.download}`, 'success');
  },

  /**
   * Parse CSV string into Array of Objects & trigger callback
   */
  triggerCSVImport(expectedFields, onParsed) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.csv')) {
        this.toast('Invalid file format. Please select a .csv file.', 'danger');
        return;
      }

      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const text = evt.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
          if (lines.length < 2) {
            this.toast('CSV file is empty or missing data rows.', 'warning');
            return;
          }

          const parseLine = line => {
            const res = [];
            let cur = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
              const ch = line[i];
              if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                  cur += '"';
                  i++;
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (ch === ',' && !inQuotes) {
                res.push(cur.trim());
                cur = '';
              } else {
                cur += ch;
              }
            }
            res.push(cur.trim());
            return res;
          };

          const rawHeaders = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
          const records = [];

          for (let i = 1; i < lines.length; i++) {
            const cols = parseLine(lines[i]);
            if (cols.length === 0 || cols.every(c => !c)) continue;
            const obj = {};
            expectedFields.forEach((field, idx) => {
              const matchIdx = rawHeaders.findIndex(h =>
                h === field.key.toLowerCase() ||
                h === field.label.toLowerCase().replace(/[^a-z0-9]/g, '')
              );
              const val = matchIdx !== -1 ? cols[matchIdx] : cols[idx];
              obj[field.key] = field.type === 'number' ? ( parseFloat(String(val || '0').replace(/[^0-9.-]/g, '')) || 0 ) : (val || field.default || '');
            });
            records.push(obj);
          }

          if (!records.length) {
            this.toast('No valid records found in CSV.', 'warning');
            return;
          }

          onParsed(records);
        } catch (err) {
          console.error(err);
          this.toast('Failed to parse CSV file. Check formatting.', 'danger');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }
};

/* ==========================================================================
   Multi-Language Translation Engine (English default, Hindi, Gujarati)
   ========================================================================== */
GZ.I18n = {
  lang: 'en',
  _timer: null,

  // Key: English string -> [Hindi, Gujarati]
  dict: {
    // Login & Brand
    'Simple Shop & Money Record': ['दुकान और पैसे का सरल हिसाब', 'દુકાન અને પૈસાનો સરળ હિસાબ'],
    'Wrong username or password.': ['यूज़रनेम या पासवर्ड गलत है।', 'યુઝરનેમ અથવા પાસવર્ડ ખોટો છે.'],
    'Your Name (Username)': ['आपका नाम (यूज़रनेम)', 'તમારું નામ (યુઝરનેમ)'],
    'Password': ['पासवर्ड', 'પાસવર્ડ'],
    'Keep me logged in': ['लॉगिन रखें', 'લોગિન રાખો'],
    'Open GameZone Records': ['गेमिंग स्टेशन हिसाब खोलें', 'ગેમિંગ સ્ટેશન હિસાબ ખોલો'],
    'Open Gaming Station Records': ['गेमिंग स्टेशन हिसाब खोलें', 'ગેમિંગ સ્ટેશન હિસાબ ખોલો'],
    'Fill Login': ['ऑटो भरें', 'ઓટો ભરો'],
    'Business Records': ['व्यापार हिसाब', 'વ્યવસાય હિસાબ'],
    'Owner / Admin': ['मालिक / एडमिन', 'માલિક / એડમિન'],
    'Important Reminders': ['ज़रूरी सूचनाएं', 'જરૂરી સૂચનાઓ'],
    'No new notifications': ['कोई नई सूचना नहीं है', 'કોઈ નવી સૂચના નથી'],
    'Server Connected': ['सर्वर जुड़ा है', 'સર્વર જોડાયેલ છે'],
    'Offline Mode': ['ऑफ़लाइन मोड', 'ઓફલાઇન મોડ'],

    // Navigation & Page Titles
    'Home': ['होम', 'હોમ'],
    'Total Business Summary': ['व्यापार का कुल सारांश', 'વ્યવસાયનો કુલ સારાંશ'],
    'Investments': ['लगाया पैसा', 'રોકાણ (મૂડી)'],
    'Money put into the shop': ['दुकान में लगाया गया पैसा', 'દુકાનમાં રોકેલા પૈસા'],
    'Expenses': ['खर्चे', 'ખર્ચા'],
    'Rent, bills & daily expenses': ['किराया, बिल और रोज़ के खर्चे', 'ભાડું, બિલ અને રોજના ખર્ચા'],
    'Payments': ['पेमेंट और बिल', 'પેમેન્ટ અને બિલ'],
    'Paid & pending bills': ['दिए गए और बाकी बिल', 'ચૂકવેલા અને બાકી બિલ'],
    'Shop Items': ['दुकान का सामान', 'દુકાનનો સામાન'],
    'Shop Items & Machines': ['दुकान का सामान और मशीनें', 'દુકાનનો સામાન અને મશીનો'],
    'PS5, TV, chairs & machines': ['PS5, टीवी, कुर्सी और मशीनें', 'PS5, ટીવી, ખુરશી અને મશીનો'],
    'Partners': ['पार्टनर', 'પાર્ટનર'],
    'Partner share & money given': ['पार्टनर का हिस्सा और दिया गया पैसा', 'પार्टनरનો ભાગ અને આપેલા પૈસા'],
    'Future Costs': ['आने वाले खर्चे', 'આગળના ખર્ચા'],
    'Planned items & work': ['आगे के सामान और काम की योजना', 'આગળના સામાન અને કામનું આયોજન'],
    'Reports': ['रिपोर्ट', 'રિપોર્ટ'],
    'Print or download full record': ['पूरा रिकॉर्ड प्रिंट या डाउनलोड करें', 'પૂરો રેકોર્ડ પ્રિન્ટ અથવા ડાઉનલોડ કરો'],
    'Settings': ['सेटिंग्स', 'સેટિંગ્સ'],
    'Shop name & data backup': ['दुकान का नाम और डेटा बैकअप', 'દુકાનનું નામ અને ડેટા બેકઅપ'],

    // Dashboard
    'Business Summary': ['व्यापार का सारांश', 'વ્યવસાયનો સારાંશ'],
    'See how much money is invested, spent, and pending in simple numbers': ['कुल कितना पैसा लगा, खर्च हुआ और बाकी है — सरल शब्दों में देखें', 'કુલ કેટલા પૈસા રોકાયા, ખર્ચાયા અને બાકી છે — સરળ ભાષામાં જુઓ'],
    'Add Investment': ['पैसा जोड़ें', 'રોકાણ ઉમેરો'],
    '+ Add Investment': ['+ पैसा जोड़ें', '+ રોકાણ ઉમેરો'],
    'Add Expense': ['खर्चा जोड़ें', 'ખર્ચ ઉમેરો'],
    '+ Add Expense': ['+ खर्चा जोड़ें', '+ ખર્ચ ઉમેરો'],
    'Add Payment': ['पेमेंट जोड़ें', 'પેમેન્ટ ઉમેરો'],
    '+ Add Payment': ['+ पेमेंट जोड़ें', '+ પેમેન્ટ ઉમેરો'],
    '+ Add Payment Record': ['+ नया पेमेंट जोड़ें', '+ નવું પેમેન્ટ ઉમેરો'],
    'Add Shop Item': ['सामान जोड़ें', 'સામાન ઉમેરો'],
    '+ Add Equipment': ['+ सामान जोड़ें', '+ સામાન ઉમેરો'],
    'Add Partner': ['पार्टनर जोड़ें', 'પાર્ટનર ઉમેરો'],
    '+ Add Business Partner': ['+ नया पार्टनर जोड़ें', '+ નવો પાર્ટનર ઉમેરો'],
    'Add Future Cost': ['आगे का खर्चा जोड़ें', 'આગળનો ખર્ચ ઉમેરો'],
    '+ Add Upcoming Cost': ['+ आगे का खर्चा जोड़ें', '+ આગળનો ખર્ચ ઉમેરો'],
    'Quick Balance': ['सीधा हिसाब', 'સીધો હિસાબ'],
    'Total money put in minus total expenses': ['कुल लगाया पैसा माइनस कुल खर्चे', 'કુલ રોકેલા પૈસા માઇનસ કુલ ખર્ચા'],
    'Money Put In': ['कुल लगा पैसा', 'કુલ રોકેલા પૈસા'],
    'Total Spent': ['कुल खर्च', 'કુલ ખર્ચ'],
    'Pending to Pay': ['देना बाकी', 'ચૂકવવાના બાકી'],
    'Balance Left': ['बचा हुआ पैसा', 'বचेલા પૈસા (બેલેન્સ)'],
    'Total Invested': ['कुल लगा पैसा', 'કુલ રોકાણ'],
    'Click to see all investments': ['सभी निवेश देखने के लिए क्लिक करें', 'બધા રોકાણ જોવા માટે ક્લિક કરો'],
    'Total Expenses': ['कुल खर्चे', 'કુલ ખર્ચા'],
    'Pending Bills': ['बाकी बिल', 'બાકી બિલ'],
    'Click to check pending bills': ['बाकी बिल देखने के लिए क्लिक करें', 'બાકી બિલ જોવા માટે ક્લિક કરો'],
    'Shop Items Value': ['सामान की कुल कीमत', 'સામાનની કુલ કિંમત'],
    'Planned upcoming work/items': ['आने वाले काम और सामान', 'આગળના કામ અને સામાન'],
    'Recent Investments': ['हाल में लगा पैसा', 'તાજેતરનું રોકાણ'],
    'Recent Expenses': ['हाल के खर्चे', 'તાજેતરના ખર્ચા'],
    'See All': ['सभी देखें', 'બધા જુઓ'],
    'No investments recorded yet.': ['अभी तक कोई निवेश दर्ज नहीं है।', 'હજુ સુધી કોઈ રોકાણ નોંધાયું નથી.'],
    'No expenses recorded yet.': ['अभी तक कोई खर्चा दर्ज नहीं है।', 'હજુ સુધી કોઈ ખર્ચ નોંધાયો નથી.'],
    'All recorded payments are settled!': ['सभी पेमेंट पूरे हो चुके हैं!', 'બધા પેમેન્ટ ચૂકવાઈ ગયા છે!'],
    'No upcoming costs scheduled.': ['कोई आने वाला खर्चा दर्ज नहीं है।', 'કોઈ આગળનો ખર્ચ નોંધાયો નથી.'],

    // Page Subtitles & Toolbars
    'Record money put into the business by Amit and partners': ['अमित और पार्टनर्स द्वारा व्यापार में लगाया गया पैसा', 'અમિત અને પાર્ટનર્સ દ્વારા ધંધામાં રોકાયેલા પૈસા'],
    'Rent, electricity, internet, staff salary, and other bills': ['किराया, बिजली, इंटरनेट, स्टाफ पगार और अन्य बिल', 'ભાડું, વીજળી, ઇન્ટરનેટ, સ્ટાફ પગાર અને અન્ય બિલ'],
    'List of PS5, TVs, controllers, racing wheels, sofas, AC & other items': ['PS5, टीवी, कंट्रोलर, रेसिंग व्हील, सोफा, AC और अन्य सामान की सूची', 'PS5, ટીવી, કંટ્રોલર, રેસિંગ વ્હીલ, સોફા, AC અને અન્ય સામાનની યાદી'],
    'Click on any partner to see all the money they have given': ['किसी भी पार्टनर पर क्लिक करके उनका पूरा हिसाब देखें', 'કોઈપણ પાર્ટનર પર ક્લિક કરીને તેમનો પૂરો હિસાબ જુઓ'],
    'Items or work planned for the future (extra chairs, AC, board, etc.)': ['भविष्य में खरीदने वाला सामान या काम (कुर्सी, AC, बोर्ड आदि)', 'ભવિષ્યમાં ખરીદવાનો સામાન અથવા કામ (ખુરશી, AC, બોર્ડ વગેરે)'],
    'Payments & Pending Bills': ['पेमेंट और बाकी बिल', 'પેમેન્ટ અને બાકી બિલ'],
    'Check who is paid and whose payment is still left': ['देखें किसको पेमेंट हो गया और किसका बाकी है', 'જુઓ કોને પેમેન્ટ થઈ ગયું અને કોનું બાકી છે'],
    'View or print full summary of Investments, Expenses, Items, Payments and Partners': ['निवेश, खर्चे, सामान, पेमेंट और पार्टनर की पूरी रिपोर्ट देखें या प्रिंट करें', 'રોકાણ, ખર્ચા, સામાન, પેમેન્ટ અને પાર્ટનરનો પૂરો રિપોર્ટ જુઓ અથવા પ્રિન્ટ કરો'],
    'Change shop name, owner name, or reset data': ['दुकान का नाम, मालिक का नाम बदलें या डेटा रीसेट करें', 'દુકાનનું નામ, માલિકનું નામ બદલો અથવા ડેટા રીસેટ કરો'],

    // Buttons & Filters
    'Filter': ['फ़िल्टर', 'ફિલ્ટર'],
    'Apply Filter': ['फ़िल्टर लगाएं', 'ફિલ્ટર લગાવો'],
    'Reset Filter': ['रीसेट करें', 'રીસેટ કરો'],
    'Show All': ['सभी दिखाएं', 'બધા બતાવો'],
    'Download Excel/CSV': ['एक्सेल/CSV डाउनलोड', 'એક્સેલ/CSV ડાઉનલોડ'],
    'Download List': ['लिस्ट डाउनलोड करें', 'લિસ્ટ ડાઉનલોડ કરો'],
    'Print / Save PDF': ['प्रिंट / PDF सेव करें', 'પ્રિન્ટ / PDF સેવ કરો'],
    'Click any column header to sort': ['क्रम बदलने के लिए किसी भी कॉलम के नाम पर क्लिक करें', 'ક્રમ બદલવા માટે કોઈપણ કોલમના નામ પર ક્લિક કરો'],
    'From Date': ['तारीख से', 'તારીખ થી'],
    'To Date': ['तारीख तक', 'તારીખ સુધી'],
    'All Investors': ['सभी निवेशक', 'બધા રોકાણકારો'],
    'All Categories': ['सभी श्रेणियां', 'બધી કેટેગરી'],
    'All Status': ['सभी स्थिति', 'બધી સ્થિતિ'],
    'All Methods': ['सभी तरीके', 'બધી રીત'],
    'All Modes': ['सभी तरीके', 'બધી રીત'],
    'All Conditions': ['सभी स्थिति', 'બધી સ્થિતિ'],
    'All Owners': ['सभी मालिक', 'બધા માલિક'],
    'All Partners': ['सभी पार्टनर', 'બધા પાર્ટનર'],
    'All': ['सभी', 'બધા'],
    'Cancel': ['रद्द करें', 'રદ કરો'],
    'Close': ['बंद करें', 'બંધ કરો'],
    'Delete': ['हटाएं', 'કાઢી નાખો'],

    // Table Headers
    'ID': ['आईडी', 'આઈડી'],
    'Date': ['तारीख', 'તારીખ'],
    'Investor': ['पैसा लगाने वाला', 'રોકાણકાર'],
    'Category': ['श्रेणी', 'કેટેગરી'],
    'Description': ['विवरण', 'વિગત'],
    'Expense Details': ['खर्चे का विवरण', 'ખર્ચની વિગત'],
    'Details': ['विवरण', 'વિગત'],
    'Amount': ['रकम', 'રકમ'],
    'Total Bill': ['कुल बिल', 'કુલ બિલ'],
    'Payment Method': ['पेमेंट का तरीका', 'પેમેન્ટની રીત'],
    'Payment Mode': ['पेमेंट का तरीका', 'પેમેન્ટની રીત'],
    'Mode': ['तरीका', 'રીત'],
    'Paid Status': ['पेमेंट स्थिति', 'પેમેન્ટ સ્થિતિ'],
    'Payment Date': ['पेमेंट तारीख', 'પેમેન્ટ તારીખ'],
    'Status': ['स्थिति', 'સ્થિતિ'],
    'Notes': ['नोट्स', 'નોંધ'],
    'Actions': ['कार्य', 'ક્રિયા'],
    'Paid To (Vendor)': ['किसको दिया (दुकान/व्यक्ति)', 'કોને આપ્યા (વેપારી)'],
    'Person / Shop': ['व्यक्ति / दुकान', 'વ્યક્તિ / દુકાન'],
    'Type': ['प्रकार', 'પ્રકાર'],
    'Item Name': ['सामान का नाम', 'સામાનનું નામ'],
    'Qty': ['संख्या', 'જથ્થો'],
    'Buy Date': ['खरीद तारीख', 'ખરીદ તારીખ'],
    'Price (1 Item)': ['1 की कीमत', '1 ની કિંમત'],
    'Total Price': ['कुल कीमत', 'કુલ કિંમત'],
    'Condition': ['हालत', 'સ્થિતિ'],
    'Warranty': ['वारंटी', 'વોરંટી'],
    'Place / Room': ['जगह / कमरा', 'જગ્યા / રૂમ'],
    'Bought By': ['किसने खरीदा', 'કોણે ખરીદ્યું'],
    'Partner Summary Table': ['पार्टनर सारांश तालिका', 'પાર્ટનર સારાંશ કોષ્ટક'],
    'Partner Name': ['पार्टनर का नाम', 'પાર્ટનરનું નામ'],
    'Total Money Given': ['कुल दिया पैसा', 'કુલ આપેલા પૈસા'],
    'Paid': ['दिया गया', 'ચૂકવેલ'],
    'Pending': ['बाकी', 'બાકી'],
    'Share (%)': ['हिस्सा (%)', 'ભાગ (%)'],
    'Last Date': ['आखिरी तारीख', 'છેલ્લી તારીખ'],
    'Importance': ['महत्व', 'મહત્વ'],
    'Work / Item Name': ['काम / सामान का नाम', 'કામ / સામાનનું નામ'],
    'Planned Date': ['तय तारीख', 'નક્કી તારીખ'],
    'Estimated Cost': ['अनुमानित खर्चा', 'અંદાજિત ખર્ચ'],
    'Priority': ['प्राथमिकता', 'પ્રાથમિકતા'],

    // Statuses & Badges
    'Partial': ['आंशिक (आधा)', 'અધૂરું (પાર્શિયલ)'],
    'Planned': ['योजना है', 'આયોજિત'],
    'Approved': ['मंज़ूर', 'મંજૂર'],
    'Cancelled': ['रद्द', 'રદ કરેલ'],
    'New': ['नया', 'નવું'],
    'Good': ['अच्छा', 'સારું'],
    'Needs Repair': ['रिपेयर ज़रूरी', 'રિપેર જરૂરી'],
    'Damaged': ['खराब', 'ખરાબ'],
    'High': ['उच्च (ज़रूरी)', 'ઉચ્ચ (જરૂરી)'],
    'Medium': ['मध्यम', 'મધ્યમ'],
    'Low': ['कम', 'ઓછું'],

    // Secondary Page KPI Titles & Subs
    'Paid Expenses': ['दिए गए खर्चे', 'ચૂકવેલા ખર્ચા'],
    'Cleared with vendors': ['दुकानदारों को भुगतान हो चुका', 'વેપારીઓને ચૂકવાઈ ગયું'],
    'Pending Expenses': ['बाकी खर्चे', 'બાકી ખर्ચા'],
    'Requires settlement': ['भुगतान करना बाकी है', 'ચૂકવવાનું બાકી છે'],
    'This Month Expense': ['इस महीने का खर्चा', 'આ મહિનાનો ખર્ચ'],
    'Current billing month': ['चालू महीने का बिल', 'ચાલુ મહિનાનું બિલ'],
    'Total Upcoming Cost': ['आने वाला कुल खर्चा', 'આગળનો કુલ ખર્ચ'],
    'Planned & Approved budget': ['तय किया गया बजट', 'નક્કી કરેલું બજેટ'],
    'High Priority Cost': ['सबसे ज़रूरी खर्चा', 'સૌથી જરૂરી ખર્ચ'],
    'Critical launch & setup items': ['तुरंत ज़रूरी काम और सामान', 'તરત જરૂરી કામ અને સામાન'],
    'Next 30 Days Cost': ['अगले 30 दिन का खर्चा', 'આগળના 30 દિવસનો ખર્ચ'],
    'Immediate cash requirement': ['जल्द लगने वाला पैसा', 'તાત્કાલિક જરૂરી પૈસા'],
    'Next 90 Days Cost': ['अगले 90 दिन का खर्चा', 'આગળના 90 દિવસનો ખર્ચ'],
    'Quarterly forecast': ['तीन महीने का अनुमान', 'ત્રણ મહિનાનો અંદાજ'],
    'Total Asset Value': ['सामान की कुल कीमत', 'સામાનની કુલ કિંમત'],
    'Total Equipment Units': ['कुल सामान संख्या', 'કુલ સામાનની સંખ્યા'],
    'Consoles, displays, chairs & accessories': ['कंसोल, टीवी, कुर्सी और सामान', 'કન્સોલ, ટીવી, ખુરશી અને સામાન'],
    'Operational (New / Good)': ['चालू हालत में (नया/अच्छा)', 'ચાલુ હાલતમાં (નવું/સારું)'],
    'Ready for gaming bays': ['इस्तेमाल के लिए तैयार', 'વાપરવા માટે તૈયાર'],
    'Needs Repair / Damaged': ['रिपेयर / खराब सामान', 'રિપેર / ખરાબ સામાન'],
    'Maintenance attention': ['ठीक कराने की ज़रूरत', 'રિપેર કરાવવાની જરૂર'],
    'Paid Amount': ['दी गई रकम', 'ચૂકવેલી રકમ'],
    'Cleared settlements': ['पूरा भुगतान हो चुका', 'પૂરું પેમેન્ટ થઈ ગયું'],
    'Pending Amount': ['बाकी रकम', 'બાકી રકમ'],
    'Outstanding balance': ['देना बाकी है', 'આપવાના બાકી છે'],
    'Partial Payments': ['आधे दिए गए बिल', 'અધૂરા ચૂકવેલા બિલ'],
    'Partly settled invoices': ['कुछ पैसा दिया, कुछ बाकी', 'થોડા પૈસા આપ્યા, થોડા બાકી'],
    'Upcoming Payments': ['आने वाले पेमेंट', 'આગળના પેમેન્ટ'],
    'Scheduled future costs': ['आगे होने वाले खर्चे', 'આગળ થનારા ખર્ચા'],
    'Invested': ['लगाया पैसा', 'રોકાણ'],
    'Click to view ledger →': ['पूरा हिसाब देखें →', 'પૂરો હિસાબ જુઓ →'],

    // Reports & Settings
    'Partner Summary': ['पार्टनर सारांश', 'પાર્ટનર સારાંશ'],
    'Total Investment': ['कुल निवेश', 'કુલ રોકાણ'],
    'Amount Paid': ['दिया गया पैसा', 'ચૂકવેલી રકમ'],
    'Amount Pending': ['बाकी पैसा', 'બાકી રકમ'],
    'Categories Covered': ['कुल श्रेणियां', 'કુલ કેટેગરી'],
    'Investment by Partner': ['पार्टनर अनुसार निवेश', 'પાર્ટનર મુજબ રોકાણ'],
    'Investment by Category': ['श्रेणी अनुसार निवेश', 'કેટેગરી મુજબ રોકાણ'],
    'Expenses by Month': ['महीने अनुसार खर्चे', 'મહિના મુજબ ખર્ચા'],
    'Expenses by Category': ['श्रेणी अनुसार खर्चे', 'કેટેગરી મુજબ ખર્ચા'],
    'Expenses by Vendor': ['दुकानदार अनुसार खर्चे', 'વેપારી મુજબ ખર્ચા'],
    'Shop Details': ['दुकान की जानकारी', 'દુકાનની માહિતી'],
    'Shop / Business Name': ['दुकान / व्यापार का नाम', 'દુકાન / વ્યવસાયનું નામ'],
    'Currency': ['मुद्रा (करेंसी)', 'ચલણ (કરન્સી)'],
    'Owner / Admin Name': ['मालिक / एडमिन का नाम', 'માલિક / એડમિનનું નામ'],
    'Screen Color Mode': ['स्क्रीन का रंग (थीम)', 'સ્ક્રીનનો રંગ (થીમ)'],
    'Light Mode (White & Clean)': ['लाइट मोड (सफ़ेद और साफ़)', 'લાઇટ મોડ (સફેદ અને સાફ)'],
    'Dark Mode': ['डार्क मोड', 'ડાર્ક મોડ'],
    'Save Settings': ['सेटिंग्स सेव करें', 'સેટિંગ્સ સેવ કરો'],
    'Data Backup & Reset': ['डेटा बैकअप और रीसेट', 'ડેટા બેકઅપ અને રીસેટ'],
    'Load Sample Records': ['उदाहरण डेटा लोड करें', 'ઉદાહરણ ડેટા લોડ કરો'],
    'Load the default GameZone example entries (PS5, TV, chairs, partners, and bills).': ['गेमिंग स्टेशन का डिफ़ॉल्ट उदाहरण डेटा (PS5, टीवी, कुर्सी, पार्टनर और बिल) वापस लोड करें।', 'ગેમિંગ સ્ટેશનનો ડિફોલ્ટ ઉદાહરણ ડેટા (PS5, ટીવી, ખુરશી, પાર્ટનર અને બિલ) પાછો લોડ કરો.'],
    'Load the default Gaming Station example entries (PS5, TV, chairs, partners, and bills).': ['गेमिंग स्टेशन का डिफ़ॉल्ट उदाहरण डेटा (PS5, टीवी, कुर्सी, पार्टनर और बिल) वापस लोड करें।', 'ગેમિંગ સ્ટેશનનો ડિફોલ્ટ ઉદાહરણ ડેટા (PS5, ટીવી, ખુરશી, પાર્ટનર અને બિલ) પાછો લોડ કરો.'],
    'Load Sample Data': ['उदाहरण डेटा लाएं', 'ઉદાહરણ ડેટા લાવો'],
    'Clear All Records': ['सारा डेटा मिटाएं', 'બધો ડેટા ભૂંસી નાખો'],
    'Delete all entries and start fresh from zero.': ['सभी रिकॉर्ड हटाकर शून्य से नई शुरुआत करें।', 'બધા રેકોર્ડ કાઢીને શૂન્યથી નવી શરૂઆત કરો.'],
    'Delete All Data': ['सारा डेटा हटाएं', 'બધો ડેટા કાઢી નાખો'],

    // Placeholders
    'Search name, item or bill...': ['नाम, सामान या बिल खोजें...', 'નામ, સામાન અથવા બિલ શોધો...'],
    'Search investments by ID, investor, PS5, TV, status...': ['निवेश खोजें (नाम, PS5, टीवी)...', 'રોકાણ શોધો (નામ, PS5, ટીવી)...'],
    'Search expense by name, shop or category...': ['खर्चा खोजें (नाम, दुकान या श्रेणी)...', 'ખર્ચ શોધો (નામ, દુકાન અથવા કેટેગરી)...'],
    'Search item (PS5, TV, chair, AC)...': ['सामान खोजें (PS5, टीवी, कुर्सी, AC)...', 'સામાન શોધો (PS5, ટીવી, ખુરશી, AC)...'],
    'Search planned item or work...': ['आगे का काम या सामान खोजें...', 'આગળનું કામ અથવા સામાન શોધો...'],
    'Search person, shop or bill...': ['व्यक्ति, दुकान या बिल खोजें...', 'વ્યક્તિ, દુકાન અથવા બિલ શોધો...']
  },

  t(str) {
    if (!str || this.lang === 'en') return str;
    const idx = this.lang === 'hi' ? 0 : this.lang === 'gu' ? 1 : -1;
    if (idx === -1) return str;

    const raw = String(str);
    const trimmed = raw.trim();
    if (!trimmed) return raw;

    // 1. Direct dictionary match
    if (this.dict[trimmed]) {
      return raw.replace(trimmed, this.dict[trimmed][idx]);
    }

    // 2. Dynamic pattern matches (numbers/amounts inside labels)
    let m;
    if ((m = trimmed.match(/^This month:\s*(.+)$/i))) {
      return idx === 0 ? `इस महीने: ${m[1]}` : `આ મહિને: ${m[1]}`;
    }
    if ((m = trimmed.match(/^Total\s+(\d+)\s+items in shop$/i))) {
      return idx === 0 ? `दुकान में कुल ${m[1]} सामान` : `દુકાનમાં કુલ ${m[1]} સામાન`;
    }
    if ((m = trimmed.match(/^Amit:\s*(.+?)\s*\((\d+)\s+partners\)$/i))) {
      return idx === 0 ? `अमित: ${m[1]} (${m[2]} पार्टनर)` : `અમિત: ${m[1]} (${m[2]} પાર્ટનર)`;
    }
    if ((m = trimmed.match(/^Across\s+(\d+)\s+expense entries$/i))) {
      return idx === 0 ? `कुल ${m[1]} खर्च एंट्री` : `કુલ ${m[1]} ખર્ચ એન્ટ્રી`;
    }
    if ((m = trimmed.match(/^(\d+)\s+Records$/i))) {
      return idx === 0 ? `${m[1]} रिकॉर्ड` : `${m[1]} રેકોર્ડ`;
    }
    if ((m = trimmed.match(/^Share:\s*(.+)$/i))) {
      return idx === 0 ? `हिस्सा: ${m[1]}` : `ભાગ: ${m[1]}`;
    }
    if ((m = trimmed.match(/^(\d+)\s+transactions$/i))) {
      return idx === 0 ? `${m[1]} लेन-देन` : `${m[1]} વ્યવહાર`;
    }
    if ((m = trimmed.match(/^Total\s*\((\d+)\s+Partners\)$/i))) {
      return idx === 0 ? `कुल (${m[1]} पार्टनर)` : `કુલ (${m[1]} પાર્ટનર)`;
    }
    if ((m = trimmed.match(/^Filtered Column Total\s*\((\d+)\s+records\)$/i))) {
      return idx === 0 ? `कुल जोड़ (${m[1]} रिकॉर्ड)` : `કુલ સરવાળો (${m[1]} રેકોર્ડ)`;
    }
    if ((m = trimmed.match(/^Showing\s+(\d+)–(\d+)\s+of\s+(\d+)$/i))) {
      return idx === 0 ? `${m[3]} में से ${m[1]}–${m[2]} दिखा रहे हैं` : `${m[3]} માંથી ${m[1]}–${m[2]} બતાવી રહ્યા છીએ`;
    }
    if ((m = trimmed.match(/^Pending:\s*(.+)$/i))) {
      return idx === 0 ? `बाकी: ${m[1]}` : `બાકી: ${m[1]}`;
    }
    if ((m = trimmed.match(/^Paid:\s*(.+)$/i))) {
      return idx === 0 ? `दिया: ${m[1]}` : `ચૂકવેલ: ${m[1]}`;
    }
    if ((m = trimmed.match(/^Total Investment:\s*$/i))) {
      return idx === 0 ? 'कुल निवेश: ' : 'કુલ રોકાણ: ';
    }
    if ((m = trimmed.match(/^Filtered Total:\s*$/i))) {
      return idx === 0 ? 'कुल जोड़: ' : 'કુલ સરવાળો: ';
    }
    if ((m = trimmed.match(/^Total Amount:\s*$/i))) {
      return idx === 0 ? 'कुल रकम: ' : 'કુલ રકમ: ';
    }

    return raw;
  },

  scheduleTranslate() {
    if (this._timer) cancelAnimationFrame(this._timer);
    this._timer = requestAnimationFrame(() => {
      this.translateDOM();
    });
  },

  translateDOM(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || p.classList.contains('lang-select')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (p.closest && p.closest('#headerLangSelect')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      if (node._origText === undefined) {
        node._origText = node.nodeValue;
      }
      const target = this.lang === 'en' ? node._origText : this.t(node._origText);
      if (node.nodeValue !== target) {
        node.nodeValue = target;
      }
    }

    root.querySelectorAll('[placeholder]').forEach(el => {
      if (el._origPh === undefined) {
        el._origPh = el.getAttribute('placeholder');
      }
      const target = this.lang === 'en' ? el._origPh : this.t(el._origPh);
      if (el.getAttribute('placeholder') !== target) {
        el.setAttribute('placeholder', target);
      }
    });
  }
};


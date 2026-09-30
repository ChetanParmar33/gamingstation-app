/* ==========================================================================
   GameZone Business Management — Chart.js Integration (js/charts.js)
   Live reactive charts for Dashboard financial visualization
   ========================================================================== */

window.GZ = window.GZ || {};

GZ.Charts = {
  instances: {},

  getPalette() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#d1d5db' : '#4b5563',
      grid: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(17, 24, 39, 0.06)',
      purple: '#6d28d9',
      violet: '#8b5cf6',
      green: '#10b981',
      orange: '#f59e0b',
      red: '#ef4444',
      blue: '#3b82f6',
      pink: '#ec4899',
      teal: '#14b8a6',
      indigo: '#6366f1',
      series: [
        '#6d28d9', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b',
        '#ec4899', '#14b8a6', '#ef4444', '#6366f1', '#a855f7'
      ]
    };
  },

  destroy(key) {
    if (this.instances[key]) {
      this.instances[key].destroy();
      delete this.instances[key];
    }
  },

  renderAll() {
    // ponytail: charts omitted for simple non-technical UI; restore canvas elements + Chart.js CDN to re-enable
    if (typeof window.Chart === 'undefined' || !document.getElementById('invVsExpChart')) {
      return;
    }

    const snap = GZ.Calc.getDashboardSnapshot();
    const palette = this.getPalette();

    this.renderInvVsExpChart(snap, palette);
    this.renderExpenseDistChart(snap, palette);
    this.renderPartnerChart(snap, palette);
    this.renderUpcomingChart(snap, palette);
  },

  renderInvVsExpChart(snap, palette) {
    const canvas = document.getElementById('invVsExpChart');
    if (!canvas) return;
    this.destroy('invVsExp');

    const monthSet = new Set([
      ...Object.keys(snap.inv.byMonth),
      ...Object.keys(snap.exp.byMonth),
      ...Object.keys(snap.pay.byMonth)
    ]);
    const months = Array.from(monthSet).sort();
    if (!months.length) months.push('2026-09');

    const labels = months.map(m => GZ.Utils.formatMonthLabel(m));
    const invData = months.map(m => snap.inv.byMonth[m] || 0);
    const expData = months.map(m => snap.exp.byMonth[m] || 0);

    // Calculate monthly paid totals from investments + expenses
    const paidByMonth = {};
    GZ.State.get('investments').forEach(r => {
      const m = GZ.Utils.getMonthKey(r.date);
      paidByMonth[m] = (paidByMonth[m] || 0) + GZ.Calc.resolveAmounts(r).paid;
    });
    GZ.State.get('expenses').forEach(r => {
      const m = GZ.Utils.getMonthKey(r.date);
      paidByMonth[m] = (paidByMonth[m] || 0) + GZ.Calc.resolveAmounts(r).paid;
    });
    const payData = months.map(m => paidByMonth[m] || 0);

    this.instances.invVsExp = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Investments',
            data: invData,
            backgroundColor: 'rgba(109, 40, 217, 0.85)',
            borderRadius: 6,
            barPercentage: 0.65
          },
          {
            label: 'Expenses',
            data: expData,
            backgroundColor: 'rgba(245, 158, 11, 0.85)',
            borderRadius: 6,
            barPercentage: 0.65
          },
          {
            type: 'line',
            label: 'Total Paid Flow',
            data: payData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#10b981',
            tension: 0.32,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: palette.text, usePointStyle: true, boxWidth: 8 }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${GZ.Utils.formatINR(ctx.raw)}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: palette.text },
            grid: { display: false }
          },
          y: {
            ticks: {
              color: palette.text,
              callback: val => GZ.Utils.formatINR(val)
            },
            grid: { color: palette.grid }
          }
        }
      }
    });
  },

  renderExpenseDistChart(snap, palette) {
    const canvas = document.getElementById('expenseDistChart');
    if (!canvas) return;
    this.destroy('expenseDist');

    // Combine expense categories and major setup categories for complete distribution
    const combinedCats = { ...snap.exp.byCategory };
    Object.entries(snap.inv.byCategory).forEach(([cat, val]) => {
      combinedCats[cat] = (combinedCats[cat] || 0) + val;
    });

    const sorted = Object.entries(combinedCats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const labels = sorted.length ? sorted.map(s => s[0]) : ['No Data'];
    const values = sorted.length ? sorted.map(s => s[1]) : [1];

    this.instances.expenseDist = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: palette.series,
            borderWidth: 2,
            borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#161324' : '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '64%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: palette.text,
              usePointStyle: true,
              boxWidth: 8,
              font: { size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${GZ.Utils.formatINR(ctx.raw)}`
            }
          }
        }
      }
    });
  },

  renderPartnerChart(snap, palette) {
    const canvas = document.getElementById('partnerInvChart');
    if (!canvas) return;
    this.destroy('partnerInv');

    const partners = snap.prt.partners;
    const labels = partners.map(p => p.name);
    const paidArr = partners.map(p => p.paid);
    const pendingArr = partners.map(p => p.pending);

    this.instances.partnerInv = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Paid Investment',
            data: paidArr,
            backgroundColor: '#7c3aed',
            borderRadius: 6
          },
          {
            label: 'Pending Settlement',
            data: pendingArr,
            backgroundColor: '#f59e0b',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: palette.text, usePointStyle: true, boxWidth: 8 }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${GZ.Utils.formatINR(ctx.raw)}`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: palette.text },
            grid: { display: false }
          },
          y: {
            stacked: true,
            ticks: {
              color: palette.text,
              callback: val => GZ.Utils.formatINR(val)
            },
            grid: { color: palette.grid }
          }
        }
      }
    });
  },

  renderUpcomingChart(snap, palette) {
    const canvas = document.getElementById('upcomingCostChart');
    if (!canvas) return;
    this.destroy('upcomingCost');

    const activeUpcoming = GZ.State.get('upcoming').filter(
      u => u.status !== 'Paid' && u.status !== 'Cancelled'
    );
    const labels = activeUpcoming.map(u =>
      u.name.length > 22 ? u.name.slice(0, 22) + '…' : u.name
    );
    const data = activeUpcoming.map(u => Number(u.estimatedAmount) || 0);
    const colors = activeUpcoming.map(u =>
      u.priority === 'High' ? '#ef4444' : u.priority === 'Medium' ? '#f59e0b' : '#3b82f6'
    );

    this.instances.upcomingCost = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['No Planned Costs'],
        datasets: [
          {
            label: 'Estimated Cost',
            data: data.length ? data : [0],
            backgroundColor: colors.length ? colors : ['#8b5cf6'],
            borderRadius: 6
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `Estimated: ${GZ.Utils.formatINR(ctx.raw)}`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: palette.text,
              callback: val => GZ.Utils.formatINR(val)
            },
            grid: { color: palette.grid }
          },
          y: {
            ticks: { color: palette.text, font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  },

  renderOfflineFallback() {
    ['invVsExpChart', 'expenseDistChart', 'partnerInvChart', 'upcomingCostChart'].forEach(id => {
      const c = document.getElementById(id);
      if (c && c.parentElement) {
        c.parentElement.innerHTML = `<div class="empty-state"><i class="fa-solid fa-chart-pie"></i><p>Chart.js ready when connected to internet.</p></div>`;
      }
    });
  }
};

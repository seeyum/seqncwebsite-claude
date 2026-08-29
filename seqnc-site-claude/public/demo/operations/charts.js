/**
 * Tiny dependency-free SVG chart + calendar helpers.
 * Each function returns an HTML string to be injected via innerHTML.
 */

var Charts = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Grouped vertical bar chart. series: [{label, values:[{label,value}], color}]
  function groupedBarChart(data, opts) {
    opts = opts || {};
    var w = opts.width || 640, h = opts.height || 220;
    var padL = 34, padB = 26, padT = 12, padR = 8;
    var innerW = w - padL - padR, innerH = h - padT - padB;
    var groups = data.groups; // [{label, bars:[{value,className}]}]
    var maxVal = 1;
    groups.forEach(function (g) { g.bars.forEach(function (b) { if (b.value > maxVal) maxVal = b.value; }); });
    maxVal = Math.ceil(maxVal * 1.15) || 1;
    var groupW = innerW / groups.length;
    var barsPerGroup = groups[0] ? groups[0].bars.length : 1;
    var barGap = 3;
    var barW = Math.max(4, (groupW - 10) / barsPerGroup - barGap);

    var bars = '';
    var labels = '';
    groups.forEach(function (g, gi) {
      var gx = padL + gi * groupW + 5;
      g.bars.forEach(function (b, bi) {
        var bh = Math.round((b.value / maxVal) * innerH);
        var bx = gx + bi * (barW + barGap);
        var by = padT + innerH - bh;
        bars += '<rect class="chart-bar ' + esc(b.className || '') + '" x="' + bx.toFixed(1) + '" y="' + by + '" width="' + barW.toFixed(1) + '" height="' + bh + '" rx="2">' +
          '<title>' + esc(g.label) + (b.name ? ' — ' + esc(b.name) : '') + ': ' + b.value + '</title></rect>';
      });
      labels += '<text class="chart-axis-label" x="' + (gx + groupW / 2 - 5) + '" y="' + (h - 6) + '" text-anchor="middle">' + esc(g.label) + '</text>';
    });

    var gridLines = '';
    var steps = 4;
    for (var i = 0; i <= steps; i++) {
      var y = padT + innerH - (innerH * i) / steps;
      gridLines += '<line class="chart-grid" x1="' + padL + '" x2="' + (w - padR) + '" y1="' + y + '" y2="' + y + '" />';
    }

    return '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" role="img">' +
      gridLines + bars + labels + '</svg>';
  }

  // Horizontal bar chart. items: [{label, value}]
  function horizontalBarChart(items, opts) {
    opts = opts || {};
    var w = opts.width || 480;
    var rowH = 28;
    var padL = opts.padL != null ? opts.padL : 120;
    var padR = 44;
    var h = items.length * rowH + 8;
    var maxVal = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    var innerW = w - padL - padR;

    var rows = items.map(function (it, i) {
      var y = i * rowH + 6;
      var bw = Math.max(2, Math.round((it.value / maxVal) * innerW));
      return '<text class="chart-row-label" x="' + (padL - 10) + '" y="' + (y + 14) + '" text-anchor="end">' + esc(it.label) + '</text>' +
        '<rect class="chart-bar chart-bar--h" x="' + padL + '" y="' + y + '" width="' + bw + '" height="16" rx="3"></rect>' +
        '<text class="chart-value-label" x="' + (padL + bw + 8) + '" y="' + (y + 13) + '">' + it.value + '</text>';
    }).join('');

    return '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" role="img">' + rows + '</svg>';
  }

  // Donut chart. slices: [{label, value, className}]
  function donutChart(slices, opts) {
    opts = opts || {};
    var size = opts.size || 160;
    var stroke = opts.stroke || 22;
    var r = (size - stroke) / 2;
    var cx = size / 2, cy = size / 2;
    var circumference = 2 * Math.PI * r;
    var total = slices.reduce(function (s, x) { return s + x.value; }, 0) || 1;
    var offset = 0;
    var segs = slices.filter(function (s) { return s.value > 0; }).map(function (s) {
      var frac = s.value / total;
      var len = frac * circumference;
      var seg = '<circle class="chart-donut-seg ' + esc(s.className || '') + '" cx="' + cx + '" cy="' + cy + '" r="' + r +
        '" fill="none" stroke-width="' + stroke + '" stroke-dasharray="' + len.toFixed(1) + ' ' + (circumference - len).toFixed(1) +
        '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')">' +
        '<title>' + esc(s.label) + ': ' + s.value + '</title></circle>';
      offset += len;
      return seg;
    }).join('');
    return '<svg class="chart-svg chart-donut" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img">' + segs + '</svg>';
  }

  // Month calendar grid. Returns HTML for a 7-col grid.
  // events: [{date:'YYYY-MM-DD', label, className}]
  function monthCalendar(year, month, events, todayISO) {
    var first = new Date(year, month, 1);
    var startDow = first.getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var byDate = {};
    events.forEach(function (e) {
      (byDate[e.date] = byDate[e.date] || []).push(e);
    });

    var cells = '';
    for (var i = 0; i < startDow; i++) {
      cells += '<div class="cal-cell cal-cell--empty"></div>';
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var mm = String(month + 1).padStart(2, '0');
      var dd = String(d).padStart(2, '0');
      var iso = year + '-' + mm + '-' + dd;
      var isToday = iso === todayISO;
      var dayEvents = byDate[iso] || [];
      var chips = dayEvents.map(function (e) {
        return '<div class="cal-chip ' + esc(e.className || '') + '" title="' + esc(e.label) + '">' + esc(e.label) + '</div>';
      }).join('');
      cells += '<div class="cal-cell' + (isToday ? ' cal-cell--today' : '') + '">' +
        '<div class="cal-daynum">' + d + '</div>' +
        '<div class="cal-chips">' + chips + '</div></div>';
    }

    var header = dowLabels.map(function (l) { return '<div class="cal-dow">' + l + '</div>'; }).join('');
    return '<div class="cal-grid">' + header + cells + '</div>';
  }

  return {
    groupedBarChart: groupedBarChart,
    horizontalBarChart: horizontalBarChart,
    donutChart: donutChart,
    monthCalendar: monthCalendar
  };
})();

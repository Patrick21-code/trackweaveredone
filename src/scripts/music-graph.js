// Music Graph Visualization for TrackWeave
// Integrates D3.js-based lyrics similarity graph into engagement page

const ARTIST_GRAPH_CONFIG = {
  '20244d07-534f-4eff-b4d4-930878889970': { // Taylor Swift (MusicBrainz ID)
    key: 'taylor',
    name: 'Taylor Swift',
    nodesFile: '../data/graph_data/taylor_nodes.csv',
    edgesFile: '../data/graph_data/taylor_edges.csv',
    albumColors: {
      "Taylor Swift": "#d97706",
      "Fearless": "#f59e0b",
      "Speak Now": "#7c3aed",
      "Red": "#dc2626",
      "1989": "#2563eb",
      "Reputation": "#4b5563",
      "Lover": "#ec4899",
      "Folklore": "#059669",
      "Evermore": "#b45309",
      "Midnights": "#4f46e5",
      "The Tortured Poets Department": "#6366f1",
    }
  },
  '381086ea-f511-4aba-bdf9-71c753dc5077': { // Kendrick Lamar (MusicBrainz ID)
    key: 'kendrick',
    name: 'Kendrick Lamar',
    nodesFile: '../data/graph_data/kendrick_nodes.csv',
    edgesFile: '../data/graph_data/kendrick_edges.csv',
    albumColors: {
      "Overly Dedicated": "#d97706",
      "Section.80": "#2563eb",
      "good kid, m.A.A.d city": "#dc2626",
      "To Pimp A Butterfly": "#059669",
      "untitled unmastered.": "#4b5563",
      "DAMN.": "#f59e0b",
      "Mr. Morale & The Big Steppers": "#7c3aed",
      "Diss Tracks": "#ec4899",
    }
  }
};

class MusicGraphVisualizer {
  constructor() {
    // Check if D3 is loaded
    if (typeof d3 === 'undefined') {
      console.error('[MusicGraph] D3.js is not loaded!');
      return;
    }
    console.log('[MusicGraph] Initializing visualizer with D3 version:', d3.version);

    this.rawNodes = [];
    this.rawEdges = [];
    this.activeAlbums = new Set();
    this.selectedNode = null;
    this.currentThreshold = 0.60;
    this.searchTerm = '';
    this.simulation = null;
    this.currentArtistId = null;
    this.currentConfig = null;

    this.svg = d3.select('#music-graph-svg');
    this.container = this.svg.append('g');
    this.linkLayer = this.container.append('g');
    this.nodeLayer = this.container.append('g');

    console.log('[MusicGraph] SVG element:', this.svg.node());

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (e) => this.container.attr('transform', e.transform));
    
    this.svg.call(zoom);
    this.svg.on('click', (e) => {
      if (e.target === this.svg.node() || e.target.tagName === 'svg') {
        this.selectedNode = null;
        this.updateHighlight();
      }
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('graph-threshold')?.addEventListener('input', (e) => {
      this.currentThreshold = parseFloat(e.target.value);
      document.getElementById('graph-thresh-val').textContent = this.currentThreshold.toFixed(2);
      this.selectedNode = null;
      this.buildGraph();
    });

    document.getElementById('graph-search')?.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.trim();
      this.selectedNode = null;
      this.buildGraph();
    });
  }

  async loadArtistGraph(artistId) {
    console.log('[MusicGraph] Loading graph for artist ID:', artistId);
    const config = ARTIST_GRAPH_CONFIG[artistId];
    
    if (!config) {
      console.warn('[MusicGraph] No graph data available for artist ID:', artistId);
      console.log('[MusicGraph] Available artist IDs:', Object.keys(ARTIST_GRAPH_CONFIG));
      document.getElementById('music-graph-section').style.display = 'none';
      return;
    }

    console.log('[MusicGraph] Found config for:', config.name);
    this.currentArtistId = artistId;
    this.currentConfig = config;
    this.showLoading(`Loading ${config.name} graph...`);
    document.getElementById('music-graph-section').style.display = 'block';
    document.getElementById('graph-artist-name').textContent = `${config.name} — Lyrics Similarity`;

    if (this.simulation) this.simulation.stop();
    this.linkLayer.selectAll('.link').remove();
    this.nodeLayer.selectAll('.node').remove();

    document.getElementById('graph-node-count').textContent = '—';
    document.getElementById('graph-edge-count').textContent = '—';
    document.getElementById('graph-album-legend').innerHTML = '';
    document.getElementById('graph-search').value = '';
    this.searchTerm = '';
    this.selectedNode = null;
    this.currentThreshold = 0.60;
    document.getElementById('graph-threshold').value = '0.60';
    document.getElementById('graph-thresh-val').textContent = '0.60';

    try {
      const [nodesRaw, edgesRaw] = await Promise.all([
        this.parseCSV(config.nodesFile),
        this.parseCSV(config.edgesFile)
      ]);

      this.rawNodes = nodesRaw
        .map(r => ({ title: r.title || r.track_name, album: r.album }))
        .filter(r => r.title && r.album);
      
      this.rawEdges = edgesRaw
        .map(r => ({ a: r.song_a, b: r.song_b, s: parseFloat(r.similarity) }))
        .filter(e => e.s < 0.99 && !isNaN(e.s));

      this.activeAlbums = new Set(this.rawNodes.map(n => n.album));
      this.hideOverlay();
      this.buildLegend();
      this.buildGraph();
    } catch (err) {
      console.error('Error loading graph data:', err);
      this.showError('Could not load graph data. Please try again later.');
    }
  }

  parseCSV(file) {
    if (typeof Papa === 'undefined') {
      console.error('[MusicGraph] PapaParse is not loaded!');
      return Promise.reject(new Error('PapaParse not loaded'));
    }
    console.log('[MusicGraph] Parsing CSV file:', file);
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        download: true,
        skipEmptyLines: true,
        complete: (r) => {
          console.log('[MusicGraph] CSV parsed successfully, rows:', r.data.length);
          resolve(r.data);
        },
        error: (err) => {
          console.error('[MusicGraph] CSV parse error:', err);
          reject(err);
        }
      });
    });
  }

  showLoading(msg) {
    const overlay = document.getElementById('graph-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('graph-overlay-msg').textContent = msg || 'Loading...';
  }

  showError(msg) {
    document.getElementById('graph-overlay-msg').textContent = msg;
  }

  hideOverlay() {
    document.getElementById('graph-overlay').classList.add('hidden');
  }

  getFilteredData() {
    const filteredNodes = this.rawNodes.filter(n => 
      this.activeAlbums.has(n.album) && 
      (!this.searchTerm || n.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    const nodeSet = new Set(filteredNodes.map(n => n.title));
    return {
      nodes: filteredNodes,
      edges: this.rawEdges.filter(e => 
        e.s >= this.currentThreshold && 
        nodeSet.has(e.a) && 
        nodeSet.has(e.b)
      )
    };
  }

  buildGraph() {
    const { nodes, edges } = this.getFilteredData();
    document.getElementById('graph-node-count').textContent = nodes.length;
    document.getElementById('graph-edge-count').textContent = edges.length;

    console.log('[MusicGraph] Building graph with', nodes.length, 'nodes and', edges.length, 'edges');

    const connMap = {};
    nodes.forEach(n => { connMap[n.title] = 0; });
    edges.forEach(e => {
      connMap[e.a] = (connMap[e.a] || 0) + 1;
      connMap[e.b] = (connMap[e.b] || 0) + 1;
    });

    const svgElement = document.getElementById('music-graph-svg');
    const area = svgElement.getBoundingClientRect();
    const W = area.width || 800;
    const H = area.height || 500;

    console.log('[MusicGraph] SVG dimensions:', W, 'x', H);

    if (this.simulation) this.simulation.stop();

    const nodeData = nodes.map(n => ({ ...n, connections: connMap[n.title] || 0 }));
    const edgeData = edges.map(e => ({ source: e.a, target: e.b, similarity: e.s }));

    console.log('[MusicGraph] Creating force simulation...');

    this.simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(edgeData)
        .id(d => d.title)
        .distance(d => 140 - (d.similarity - 0.6) * 200)
        .strength(0.3))
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(18))
      .alphaDecay(0.03);

    const links = this.linkLayer.selectAll('.link').data(edgeData, d => d.source + '-' + d.target);
    links.exit().remove();
    const allLinks = links.enter().append('line').attr('class', 'link').merge(links)
      .attr('stroke', d => {
        const sn = nodeData.find(n => n.title === (typeof d.source === 'object' ? d.source.title : d.source));
        return sn ? (this.currentConfig.albumColors[sn.album] || '#888') : '#888';
      })
      .attr('stroke-width', d => 1.2 + (d.similarity - 0.6) * 6);

    const drag = d3.drag()
      .on('start', (e, d) => {
        if (!e.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on('end', (e, d) => {
        if (!e.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeGroups = this.nodeLayer.selectAll('.node').data(nodeData, d => d.title);
    nodeGroups.exit().remove();
    const nodeEnter = nodeGroups.enter().append('g').attr('class', 'node').call(drag);
    nodeEnter.append('circle');
    nodeEnter.append('text');
    const allNodes = nodeEnter.merge(nodeGroups);

    allNodes.select('circle')
      .attr('r', d => 4 + Math.sqrt(d.connections) * 1.5)
      .attr('fill', d => (this.currentConfig.albumColors[d.album] || '#888') + 'cc')
      .attr('stroke', d => this.currentConfig.albumColors[d.album] || '#888');

    allNodes.select('text')
      .text(d => d.connections >= 8 ? d.title.slice(0, 14) : '')
      .attr('dy', d => -(5 + Math.sqrt(d.connections) * 1.5));

    allNodes
      .on('click', (e, d) => {
        e.stopPropagation();
        this.selectedNode = this.selectedNode === d.title ? null : d.title;
        this.updateHighlight();
        this.showTooltip(e, d, edgeData);
      })
      .on('mouseover', (e, d) => this.showTooltip(e, d, edgeData))
      .on('mouseout', () => {
        if (!this.selectedNode) this.hideTooltip();
      });

    this.simulation.on('tick', () => {
      allLinks
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      allNodes.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    this.updateHighlight();
  }

  updateHighlight() {
    if (!this.selectedNode) {
      this.nodeLayer.selectAll('.node').style('opacity', 1);
      this.linkLayer.selectAll('.link').style('opacity', 0.6);
      return;
    }

    const connected = new Set([this.selectedNode]);
    this.linkLayer.selectAll('.link').each(function (d) {
      const s = typeof d.source === 'object' ? d.source.title : d.source;
      const t = typeof d.target === 'object' ? d.target.title : d.target;
      if (s === this.selectedNode) connected.add(t);
      if (t === this.selectedNode) connected.add(s);
    }.bind(this));

    this.nodeLayer.selectAll('.node').style('opacity', d => connected.has(d.title) ? 1 : 0.1);
    this.linkLayer.selectAll('.link').style('opacity', d => {
      const s = typeof d.source === 'object' ? d.source.title : d.source;
      const t = typeof d.target === 'object' ? d.target.title : d.target;
      return (s === this.selectedNode || t === this.selectedNode) ? 1 : 0.05;
    });
  }

  showTooltip(e, d, edgeData) {
    document.getElementById('graph-tt-title').textContent = d.title;
    document.getElementById('graph-tt-album').textContent = d.album;
    document.getElementById('graph-tt-connections').textContent = d.connections;

    const neighbors = edgeData
      .filter(edge => {
        const s = typeof edge.source === 'object' ? edge.source.title : edge.source;
        const t = typeof edge.target === 'object' ? edge.target.title : edge.target;
        return s === d.title || t === d.title;
      })
      .map(edge => {
        const s = typeof edge.source === 'object' ? edge.source.title : edge.source;
        const t = typeof edge.target === 'object' ? edge.target.title : edge.target;
        return { name: s === d.title ? t : s, score: edge.similarity };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    document.getElementById('graph-tt-similar').textContent = neighbors.length
      ? 'Top matches: ' + neighbors.map(n => `${n.name} (${n.score.toFixed(2)})`).join(', ')
      : '';

    const area = document.getElementById('music-graph-svg').getBoundingClientRect();
    let x = e.clientX - area.left + 12;
    let y = e.clientY - area.top - 12;
    if (x + 230 > area.width) x = e.clientX - area.left - 230;
    if (y + 140 > area.height) y = e.clientY - area.top - 140;

    const tt = document.getElementById('graph-tooltip');
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
    tt.classList.add('visible');
  }

  hideTooltip() {
    document.getElementById('graph-tooltip').classList.remove('visible');
  }

  buildLegend() {
    const counts = {};
    this.rawNodes.forEach(n => {
      counts[n.album] = (counts[n.album] || 0) + 1;
    });

    const legend = document.getElementById('graph-album-legend');
    legend.innerHTML = '';

    Object.entries(this.currentConfig.albumColors).forEach(([album, color]) => {
      if (!counts[album]) return;

      const item = document.createElement('div');
      item.className = 'graph-album-item';
      item.innerHTML = `
        <div class="graph-album-dot" style="background:${color}"></div>
        <span class="graph-album-name">${album}</span>
        <span class="graph-album-count">${counts[album]}</span>
      `;

      item.addEventListener('click', () => {
        if (this.activeAlbums.has(album)) {
          if (this.activeAlbums.size > 1) {
            this.activeAlbums.delete(album);
            item.classList.add('dimmed');
          }
        } else {
          this.activeAlbums.add(album);
          item.classList.remove('dimmed');
        }
        this.selectedNode = null;
        this.buildGraph();
      });

      legend.appendChild(item);
    });
  }
}

// Initialize the graph visualizer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[MusicGraph] DOM loaded, initializing visualizer...');
    window.musicGraphVisualizer = new MusicGraphVisualizer();
  });
} else {
  console.log('[MusicGraph] DOM already loaded, initializing visualizer...');
  window.musicGraphVisualizer = new MusicGraphVisualizer();
}

// Export function to load graph for a specific artist
window.loadMusicGraph = function(artistId) {
  console.log('[MusicGraph] loadMusicGraph called with artistId:', artistId);
  if (window.musicGraphVisualizer) {
    window.musicGraphVisualizer.loadArtistGraph(artistId);
  } else {
    console.error('[MusicGraph] Visualizer not initialized yet!');
  }
};

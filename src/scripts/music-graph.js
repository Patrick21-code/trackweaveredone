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
  },
  'f4fdbb4c-e4b7-47a0-b83b-d91bbfcfa387': { // Ariana Grande (MusicBrainz ID)
    key: 'arianagrande',
    name: 'Ariana Grande',
    nodesFile: '../data/graph_data/arianagrande_nodes.csv',
    edgesFile: '../data/graph_data/arianagrande_edges.csv',
    albumColors: {}
  },
  '859d0860-d480-4efd-970c-c05d5f1776b8': { // Beyoncé (MusicBrainz ID)
    key: 'beyonce',
    name: 'Beyoncé',
    nodesFile: '../data/graph_data/beyonce_nodes.csv',
    edgesFile: '../data/graph_data/beyonce_edges.csv',
    albumColors: {}
  },
  'f4abc0b5-3f7a-4eff-8f78-ac078dbce533': { // Billie Eilish (MusicBrainz ID)
    key: 'billieeilish',
    name: 'Billie Eilish',
    nodesFile: '../data/graph_data/billieeilish_nodes.csv',
    edgesFile: '../data/graph_data/billieeilish_edges.csv',
    albumColors: {}
  },
  '0f37095c-0e36-4e0e-8a40-0c2f7d7c5ae4': { // BTS (MusicBrainz ID)
    key: 'bts',
    name: 'BTS',
    nodesFile: '../data/graph_data/bts_nodes.csv',
    edgesFile: '../data/graph_data/bts_edges.csv',
    albumColors: {}
  },
  'a5d7e7cf-a8b6-4b6e-a6e8-7e7e7e7e7e7e': { // Cardi B (MusicBrainz ID)
    key: 'cardib',
    name: 'Cardi B',
    nodesFile: '../data/graph_data/cardib_nodes.csv',
    edgesFile: '../data/graph_data/cardib_edges.csv',
    albumColors: {}
  },
  'a5d7e7cf-a8b6-4b6e-a6e8-8e8e8e8e8e8e': { // Charlie Puth (MusicBrainz ID)
    key: 'charlieputh',
    name: 'Charlie Puth',
    nodesFile: '../data/graph_data/charlieputh_nodes.csv',
    edgesFile: '../data/graph_data/charlieputh_edges.csv',
    albumColors: {}
  },
  'cc197bad-dc9c-440d-a5b5-d52ba2e14234': { // Coldplay (MusicBrainz ID)
    key: 'coldplay',
    name: 'Coldplay',
    nodesFile: '../data/graph_data/coldplay_nodes.csv',
    edgesFile: '../data/graph_data/coldplay_edges.csv',
    albumColors: {}
  },
  'b49b81cc-d5b7-4bdd-aadb-385df8de69a6': { // Drake (MusicBrainz ID)
    key: 'drake',
    name: 'Drake',
    nodesFile: '../data/graph_data/drake_nodes.csv',
    edgesFile: '../data/graph_data/drake_edges.csv',
    albumColors: {}
  },
  '5f1adfe1-4d07-4141-b181-79e5d379d539': { // Dua Lipa (MusicBrainz ID)
    key: 'dualipa',
    name: 'Dua Lipa',
    nodesFile: '../data/graph_data/dualipa_nodes.csv',
    edgesFile: '../data/graph_data/dualipa_edges.csv',
    albumColors: {}
  },
  'b8a7c51f-362c-4dcb-a259-bc6e0095f0a6': { // Ed Sheeran (MusicBrainz ID)
    key: 'edsheeran',
    name: 'Ed Sheeran',
    nodesFile: '../data/graph_data/edsheeran_nodes.csv',
    edgesFile: '../data/graph_data/edsheeran_edges.csv',
    albumColors: {}
  },
  'b95ce3ff-3d05-4e87-9e01-c97b66af13d4': { // Eminem (MusicBrainz ID)
    key: 'eminem',
    name: 'Eminem',
    nodesFile: '../data/graph_data/eminem_nodes.csv',
    edgesFile: '../data/graph_data/eminem_edges.csv',
    albumColors: {}
  },
  'e0140a67-e4d1-4f13-8a01-364355bee46e': { // Justin Bieber (MusicBrainz ID)
    key: 'justinbieber',
    name: 'Justin Bieber',
    nodesFile: '../data/graph_data/justinbieber_nodes.csv',
    edgesFile: '../data/graph_data/justinbieber_edges.csv',
    albumColors: {}
  },
  '122d63fc-8671-43e4-9752-34e846d62a9c': { // Katy Perry (MusicBrainz ID)
    key: 'katyperry',
    name: 'Katy Perry',
    nodesFile: '../data/graph_data/katyperry_nodes.csv',
    edgesFile: '../data/graph_data/katyperry_edges.csv',
    albumColors: {}
  },
  '2fa9f0d5-e787-4348-b2c6-7f8d0e3e7e7e': { // Khalid (MusicBrainz ID)
    key: 'khalid',
    name: 'Khalid',
    nodesFile: '../data/graph_data/khalid_nodes.csv',
    edgesFile: '../data/graph_data/khalid_edges.csv',
    albumColors: {}
  },
  '650e7db6-b795-4eb5-a702-5ea2fc46c848': { // Lady Gaga (MusicBrainz ID)
    key: 'ladygaga',
    name: 'Lady Gaga',
    nodesFile: '../data/graph_data/ladygaga_nodes.csv',
    edgesFile: '../data/graph_data/ladygaga_edges.csv',
    albumColors: {}
  },
  '0ab49580-c84f-44d4-875f-d83760ea2cfe': { // Maroon 5 (MusicBrainz ID)
    key: 'maroon5',
    name: 'Maroon 5',
    nodesFile: '../data/graph_data/maroon5_nodes.csv',
    edgesFile: '../data/graph_data/maroon5_edges.csv',
    albumColors: {}
  },
  '9f8e5e8e-8e8e-8e8e-8e8e-8e8e8e8e8e8e': { // Nicki Minaj (MusicBrainz ID)
    key: 'nickiminaj',
    name: 'Nicki Minaj',
    nodesFile: '../data/graph_data/nickiminaj_nodes.csv',
    edgesFile: '../data/graph_data/nickiminaj_edges.csv',
    albumColors: {}
  },
  'b1e26560-60e5-4236-bbdb-9aa5a8d5ee19': { // Post Malone (MusicBrainz ID)
    key: 'postmalone',
    name: 'Post Malone',
    nodesFile: '../data/graph_data/postmalone_nodes.csv',
    edgesFile: '../data/graph_data/postmalone_edges.csv',
    albumColors: {}
  },
  '73e5e69d-3554-40d8-8516-00cb38737a1c': { // Rihanna (MusicBrainz ID)
    key: 'rihanna',
    name: 'Rihanna',
    nodesFile: '../data/graph_data/rihanna_nodes.csv',
    edgesFile: '../data/graph_data/rihanna_edges.csv',
    albumColors: {}
  },
  '7ec371f3-8336-4f1c-b2a7-55e38c9f9e7e': { // Selena Gomez (MusicBrainz ID)
    key: 'selenagomez',
    name: 'Selena Gomez',
    nodesFile: '../data/graph_data/selenagomez_nodes.csv',
    edgesFile: '../data/graph_data/selenagomez_edges.csv',
    albumColors: {}
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

    // Set initial SVG dimensions
    this.updateSVGDimensions();

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

    // Add resize observer to handle container size changes
    this.setupResizeObserver();
    this.setupEventListeners();
  }

  updateSVGDimensions() {
    const svgElement = document.getElementById('music-graph-svg');
    if (!svgElement) return;
    
    const canvasArea = svgElement.parentElement;
    if (!canvasArea) return;
    
    const rect = canvasArea.getBoundingClientRect();
    
    if (rect.width > 0 && rect.height > 0) {
      // Set SVG attributes for proper rendering
      svgElement.setAttribute('width', rect.width);
      svgElement.setAttribute('height', rect.height);
      svgElement.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      
      console.log('[MusicGraph] SVG dimensions set to:', rect.width, 'x', rect.height);
      return { width: rect.width, height: rect.height };
    }
    
    return null;
  }

  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') {
      console.warn('[MusicGraph] ResizeObserver not supported, using fallback');
      return;
    }

    const canvasArea = document.querySelector('.graph-canvas-area');
    if (!canvasArea) {
      console.warn('[MusicGraph] Canvas area not found for ResizeObserver');
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          console.log('[MusicGraph] Container resized to:', width, 'x', height);
          
          // Only rebuild if we have data loaded
          if (this.currentArtistId && this.rawNodes.length > 0) {
            // Update dimensions
            this.updateSVGDimensions();
            
            // Debounce the rebuild to avoid too many updates
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
              console.log('[MusicGraph] Rebuilding graph after resize');
              this.buildGraph();
            }, 300);
          }
        }
      }
    });

    this.resizeObserver.observe(canvasArea);
    console.log('[MusicGraph] ResizeObserver attached to canvas area');
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

    // Update SVG dimensions before building
    const dims = this.updateSVGDimensions();
    
    // Get dimensions - try from update, then from attributes, then fallback
    let W, H;
    if (dims) {
      W = dims.width;
      H = dims.height;
    } else {
      const svgElement = document.getElementById('music-graph-svg');
      W = parseFloat(svgElement.getAttribute('width')) || 800;
      H = parseFloat(svgElement.getAttribute('height')) || 500;
    }

    console.log('[MusicGraph] Using dimensions for simulation:', W, 'x', H);

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

    // Generate colors for albums if not predefined
    const albumsToDisplay = Object.keys(counts);
    const colorPalette = [
      "#2563eb", "#dc2626", "#059669", "#d97706", "#7c3aed", 
      "#ec4899", "#f59e0b", "#4b5563", "#b45309", "#4f46e5",
      "#06b6d4", "#10b981", "#f97316", "#8b5cf6", "#ef4444",
      "#14b8a6", "#f43f5e", "#6366f1", "#84cc16", "#a855f7"
    ];

    // If no album colors are defined, generate them
    if (Object.keys(this.currentConfig.albumColors).length === 0) {
      albumsToDisplay.forEach((album, index) => {
        this.currentConfig.albumColors[album] = colorPalette[index % colorPalette.length];
      });
    }

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

// Fullscreen toggle function
window.toggleGraphFullscreen = function() {
  const graphSection = document.getElementById('music-graph-section');
  const fullscreenBtn = document.getElementById('graph-fullscreen-btn');
  const enterIcon = fullscreenBtn.querySelector('.fullscreen-enter-icon');
  const exitIcon = fullscreenBtn.querySelector('.fullscreen-exit-icon');
  
  if (graphSection.classList.contains('fullscreen')) {
    // Exit fullscreen
    graphSection.classList.remove('fullscreen');
    enterIcon.style.display = 'block';
    exitIcon.style.display = 'none';
    fullscreenBtn.title = 'Toggle fullscreen';
  } else {
    // Enter fullscreen
    graphSection.classList.add('fullscreen');
    enterIcon.style.display = 'none';
    exitIcon.style.display = 'block';
    fullscreenBtn.title = 'Exit fullscreen';
  }
  
  // Wait for CSS transition and layout to complete, then rebuild graph
  setTimeout(() => {
    if (window.musicGraphVisualizer && window.musicGraphVisualizer.currentArtistId) {
      console.log('[MusicGraph] Fullscreen toggled, updating dimensions...');
      
      // Update SVG dimensions to match new container size
      window.musicGraphVisualizer.updateSVGDimensions();
      
      // Stop existing simulation
      if (window.musicGraphVisualizer.simulation) {
        window.musicGraphVisualizer.simulation.stop();
      }
      
      // Clear existing nodes' fixed positions to allow repositioning
      if (window.musicGraphVisualizer.simulation) {
        window.musicGraphVisualizer.simulation.nodes().forEach(node => {
          node.fx = null;
          node.fy = null;
        });
      }
      
      // Rebuild the graph with new dimensions
      window.musicGraphVisualizer.buildGraph();
      
      // Give simulation a boost to settle into new space
      if (window.musicGraphVisualizer.simulation) {
        window.musicGraphVisualizer.simulation.alpha(1).restart();
      }
    }
  }, 250);
};

// Add keyboard shortcut for fullscreen (ESC to exit)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const graphSection = document.getElementById('music-graph-section');
    if (graphSection && graphSection.classList.contains('fullscreen')) {
      window.toggleGraphFullscreen();
    }
  }
});

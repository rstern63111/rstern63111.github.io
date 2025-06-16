// Client Management System
class ClientManagementSystem {
    constructor() {
        this.clients = new Map();
        this.appointments = new Map();
        this.returns = new Map();
        this.notes = new Map();
        this.referrals = new Map();
    }

    initialize() {
        // Add some sample clients for testing
        this.addSampleClients();
    }

    addSampleClients() {
        const sampleClients = [
            {
                id: 'client_1',
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '555-0123',
                type: 'individual',
                status: 'active',
                joinDate: '2025-01-15',
                returns: ['2024', '2023'],
                complexity: 'medium',
                satisfaction: 95,
                totalRevenue: 1200
            },
            {
                id: 'client_2',
                name: 'Tech Startup LLC',
                email: 'contact@techstartup.com',
                phone: '555-0124',
                type: 'business',
                status: 'active',
                joinDate: '2024-12-01',
                returns: ['2024'],
                complexity: 'high',
                satisfaction: 90,
                totalRevenue: 3500
            }
        ];

        sampleClients.forEach(client => {
            this.clients.set(client.id, client);
            this.initializeClientData(client.id);
        });
    }

    initializeClientData(clientId) {
        this.returns.set(clientId, []);
        this.appointments.set(clientId, []);
        this.notes.set(clientId, []);
        this.referrals.set(clientId, []);
    }

    addClient(clientData) {
        const clientId = `client_${Date.now()}`;
        const newClient = {
            id: clientId,
            ...clientData,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            returns: [],
            satisfaction: 100,
            totalRevenue: 0
        };

        this.clients.set(clientId, newClient);
        this.initializeClientData(clientId);
        return clientId;
    }

    getClient(clientId) {
        return this.clients.get(clientId);
    }

    updateClient(clientId, updates) {
        const client = this.clients.get(clientId);
        if (!client) return false;

        Object.assign(client, updates);
        this.clients.set(clientId, client);
        return true;
    }

    addReturn(clientId, returnData) {
        const returns = this.returns.get(clientId) || [];
        const returnId = `return_${Date.now()}`;
        
        const newReturn = {
            id: returnId,
            ...returnData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        returns.push(newReturn);
        this.returns.set(clientId, returns);
        return returnId;
    }

    scheduleAppointment(clientId, appointmentData) {
        const appointments = this.appointments.get(clientId) || [];
        const appointmentId = `apt_${Date.now()}`;
        
        const newAppointment = {
            id: appointmentId,
            ...appointmentData,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        appointments.push(newAppointment);
        this.appointments.set(clientId, appointments);
        return appointmentId;
    }

    addNote(clientId, noteData) {
        const notes = this.notes.get(clientId) || [];
        const noteId = `note_${Date.now()}`;
        
        const newNote = {
            id: noteId,
            ...noteData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        notes.push(newNote);
        this.notes.set(clientId, notes);
        return noteId;
    }

    addReferral(clientId, referralData) {
        const referrals = this.referrals.get(clientId) || [];
        const referralId = `ref_${Date.now()}`;
        
        const newReferral = {
            id: referralId,
            ...referralData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        referrals.push(newReferral);
        this.referrals.set(clientId, referrals);
        return referralId;
    }

    // UI Methods
    createClientUI() {
        const container = document.createElement('div');
        container.className = 'client-management';
        
        container.innerHTML = `
            <div class="client-header">
                <h2>Client Management</h2>
                <button class="nav-button" onclick="showAddClientModal()">
                    <i class="fas fa-user-plus"></i> Add Client
                </button>
            </div>

            <div class="client-search">
                <input type="text" 
                       class="search-input" 
                       placeholder="Search clients..."
                       onkeyup="searchClients(this.value)">
                <button class="nav-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="client-filters">
                <button class="filter-button active" data-filter="all">All</button>
                <button class="filter-button" data-filter="individual">Individual</button>
                <button class="filter-button" data-filter="business">Business</button>
                <button class="filter-button" data-filter="active">Active</button>
                <button class="filter-button" data-filter="pending">Pending</button>
            </div>

            <div class="client-list">
                ${this.renderClientList()}
            </div>
        `;

        this.setupEventListeners(container);
        return container;
    }

    renderClientList() {
        if (this.clients.size === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Clients Yet</h3>
                    <p>Start by adding your first client!</p>
                </div>
            `;
        }

        return Array.from(this.clients.values()).map(client => `
            <div class="client-card" data-client-id="${client.id}">
                <div class="client-avatar">
                    <i class="fas fa-${client.type === 'business' ? 'building' : 'user'}"></i>
                </div>
                <div class="client-info">
                    <div class="client-name">${client.name}</div>
                    <div class="client-details">
                        <span><i class="fas fa-envelope"></i> ${client.email}</span>
                        <span><i class="fas fa-phone"></i> ${client.phone}</span>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="client-action-btn" 
                            onclick="scheduleAppointment('${client.id}')"
                            data-tooltip="Schedule Appointment">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="client-action-btn"
                            onclick="startReturn('${client.id}')"
                            data-tooltip="Start Return">
                        <i class="fas fa-file-invoice-dollar"></i>
                    </button>
                    <button class="client-action-btn"
                            onclick="viewClientDetails('${client.id}')"
                            data-tooltip="View Details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners(container) {
        // Filter buttons
        container.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                container.querySelectorAll('.filter-button').forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.filterClients(button.dataset.filter);
            });
        });

        // Client cards
        container.querySelectorAll('.client-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.client-action-btn')) {
                    this.viewClientDetails(card.dataset.clientId);
                }
            });
        });
    }

    filterClients(filter) {
        const clientList = document.querySelector('.client-list');
        const clients = Array.from(this.clients.values());
        
        const filtered = filter === 'all' ? clients :
            clients.filter(client => 
                client.type === filter || client.status === filter
            );

        clientList.innerHTML = filtered.length ? 
            this.renderClientList(filtered) :
            `<div class="empty-state">No clients match the filter</div>`;
    }

    searchClients(query) {
        const clientList = document.querySelector('.client-list');
        const clients = Array.from(this.clients.values());
        
        const filtered = query ? clients.filter(client =>
            client.name.toLowerCase().includes(query.toLowerCase()) ||
            client.email.toLowerCase().includes(query.toLowerCase())
        ) : clients;

        clientList.innerHTML = filtered.length ?
            this.renderClientList(filtered) :
            `<div class="empty-state">No clients match the search</div>`;
    }
}

export { ClientManagementSystem };
class ClientManagementSystem {
    constructor() {
        this.clients = new Map();
        this.appointments = new Map();
        this.returns = new Map();
        this.currentFilter = 'all';
    }

    initialize() {
        // Add some sample clients
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
                returns: ['2024'],
                satisfaction: 95,
                revenue: 1200
            },
            {
                id: 'client_2',
                name: 'Tech Startup LLC',
                email: 'contact@techstartup.com',
                phone: '555-0124',
                type: 'business',
                status: 'active',
                returns: ['2024', '2023'],
                satisfaction: 90,
                revenue: 3500
            }
        ];

        sampleClients.forEach(client => this.addClient(client));
    }

    addClient(clientData) {
        const clientId = clientData.id || `client_${Date.now()}`;
        this.clients.set(clientId, {
            ...clientData,
            id: clientId,
            joinDate: new Date().toISOString().split('T')[0]
        });
        return clientId;
    }

    getClient(clientId) {
        return this.clients.get(clientId);
    }

    updateClient(clientId, updates) {
        const client = this.clients.get(clientId);
        if (!client) return false;
        
        this.clients.set(clientId, { ...client, ...updates });
        return true;
    }

    scheduleAppointment(clientId, appointmentData) {
        const appointments = this.appointments.get(clientId) || [];
        const appointmentId = `apt_${Date.now()}`;
        
        const newAppointment = {
            id: appointmentId,
            ...appointmentData,
            status: 'scheduled'
        };

        appointments.push(newAppointment);
        this.appointments.set(clientId, appointments);
        return appointmentId;
    }

    addReturn(clientId, returnData) {
        const returns = this.returns.get(clientId) || [];
        const returnId = `return_${Date.now()}`;
        
        const newReturn = {
            id: returnId,
            ...returnData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        returns.push(newReturn);
        this.returns.set(clientId, returns);
        return returnId;
    }

    // UI Methods
    createClientUI() {
        const container = document.createElement('div');
        container.className = 'client-management';
        
        container.innerHTML = `
            <div class="client-header">
                <h2>Client Management</h2>
                <button class="nav-button" onclick="game.clientSystem.showAddClientForm()">
                    <i class="fas fa-user-plus"></i> Add Client
                </button>
            </div>

            <div class="client-search">
                <input type="text" 
                       class="search-input" 
                       placeholder="Search clients..."
                       onkeyup="game.clientSystem.searchClients(this.value)">
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

            <div class="client-details-panel">
                <!-- Client details will be dynamically inserted here -->
            </div>
        `;

        this.setupEventListeners(container);
        return container;
    }

    renderClientList() {
        const clients = Array.from(this.clients.values());
        if (clients.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Clients Yet</h3>
                    <p>Start by adding your first client!</p>
                </div>
            `;
        }

        return clients
            .filter(client => this.filterClient(client))
            .map(client => this.renderClientCard(client))
            .join('');
    }

    renderClientCard(client) {
        return `
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
                    <div class="client-meta">
                        <span class="client-type">${client.type}</span>
                        <span class="client-returns">${client.returns.length} returns</span>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="client-action-btn" 
                            onclick="game.clientSystem.scheduleAppointment('${client.id}')"
                            title="Schedule Appointment">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="client-action-btn"
                            onclick="game.clientSystem.startReturn('${client.id}')"
                            title="Start Return">
                        <i class="fas fa-file-invoice-dollar"></i>
                    </button>
                    <button class="client-action-btn"
                            onclick="game.clientSystem.viewClientDetails('${client.id}')"
                            title="View Details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `;
    }

    showAddClientForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add New Client</h3>
                <form class="add-client-form" onsubmit="game.clientSystem.handleAddClient(event)">
                    <div class="form-group">
                        <label>Client Type</label>
                        <select class="form-input" name="type" required>
                            <option value="individual">Individual</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-input" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-input" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" class="form-input" name="phone" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="nav-button">Add Client</button>
                        <button type="button" class="nav-button" 
                                onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleAddClient(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const clientData = {
            type: formData.get('type'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            status: 'active',
            returns: []
        };

        this.addClient(clientData);
        event.target.closest('.modal').remove();
        this.updateClientList();
        this.showNotification('Client added successfully!');
    }

    viewClientDetails(clientId) {
        const client = this.getClient(clientId);
        const panel = document.querySelector('.client-details-panel');
        
        panel.innerHTML = `
            <div class="client-profile">
                <h3>${client.name}</h3>
                <p>${client.email}</p>
                <p>${client.phone}</p>
            </div>

            <div class="client-stats">
                <div class="stat-box">
                    <div class="stat-value">${client.returns.length}</div>
                    <div class="stat-label">Returns</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${client.satisfaction}%</div>
                    <div class="stat-label">Satisfaction</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">$${client.revenue}</div>
                    <div class="stat-label">Revenue</div>
                </div>
            </div>

            <div class="returns-history">
                <h4>Returns History</h4>
                ${this.renderReturnsHistory(clientId)}
            </div>

            <div class="appointments">
                <h4>Upcoming Appointments</h4>
                ${this.renderAppointments(clientId)}
            </div>
        `;

        panel.classList.add('active');
    }

    renderReturnsHistory(clientId) {
        const returns = this.returns.get(clientId) || [];
        if (returns.length === 0) {
            return '<p>No returns filed yet.</p>';
        }

        return returns.map(ret => `
            <div class="return-item">
                <div class="return-info">
                    <strong>${ret.year} Tax Return</strong>
                    <span>${ret.status}</span>
                </div>
                <div class="return-date">
                    ${new Date(ret.createdAt).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }

    renderAppointments(clientId) {
        const appointments = this.appointments.get(clientId) || [];
        if (appointments.length === 0) {
            return '<p>No upcoming appointments.</p>';
        }

        return appointments.map(apt => `
            <div class="appointment-item">
                <div class="appointment-info">
                    <strong>${apt.type}</strong>
                    <span>${apt.date} ${apt.time}</span>
                </div>
                <div class="appointment-status ${apt.status}">
                    ${apt.status}
                </div>
            </div>
        `).join('');
    }

    scheduleAppointment(clientId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Schedule Appointment</h3>
                <form class="appointment-form" onsubmit="game.clientSystem.handleScheduleAppointment(event, '${clientId}')">
                    <div class="form-group">
                        <label>Type</label>
                        <select class="form-input" name="type" required>
                            <option value="consultation">Consultation</option>
                            <option value="tax_prep">Tax Preparation</option>
                            <option value="review">Return Review</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" class="form-input" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" class="form-input" name="time" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="nav-button">Schedule</button>
                        <button type="button" class="nav-button" 
                                onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleScheduleAppointment(event, clientId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const appointmentData = {
            type: formData.get('type'),
            date: formData.get('date'),
            time: formData.get('time')
        };

        this.scheduleAppointment(clientId, appointmentData);
        event.target.closest('.modal').remove();
        this.showNotification('Appointment scheduled successfully!');
    }

    startReturn(clientId) {
        // Implement tax return workflow
        this.showNotification('Tax return feature coming soon!');
    }

    filterClient(client) {
        if (this.currentFilter === 'all') return true;
        if (this.currentFilter === 'individual' || this.currentFilter === 'business') {
            return client.type === this.currentFilter;
        }
        return client.status === this.currentFilter;
    }

    searchClients(query) {
        const clientList = document.querySelector('.client-list');
        const clients = Array.from(this.clients.values());
        
        const filtered = query ? clients.filter(client =>
            client.name.toLowerCase().includes(query.toLowerCase()) ||
            client.email.toLowerCase().includes(query.toLowerCase())
        ) : clients;

        clientList.innerHTML = filtered.length ?
            filtered.map(client => this.renderClientCard(client)).join('') :
            '<div class="empty-state">No clients match your search.</div>';
    }

    setupEventListeners(container) {
        // Filter buttons
        container.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                container.querySelectorAll('.filter-button').forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.updateClientList();
            });
        });

        // Close client details panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.querySelector('.client-details-panel');
            const isClickInside = panel.contains(e.target);
            if (!isClickInside && panel.classList.contains('active')) {
                panel.classList.remove('active');
            }
        });
    }

    updateClientList() {
        const clientList = document.querySelector('.client-list');
        clientList.innerHTML = this.renderClientList();
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Export the class
export { ClientManagementSystem };

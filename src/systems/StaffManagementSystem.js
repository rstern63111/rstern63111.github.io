// Staff Management System
class StaffManagementSystem {
    constructor() {
        this.staff = new Map();
        this.assignments = new Map();
        this.schedules = new Map();
        this.skills = new Map();
        this.trainingPrograms = new Map();
    }

    initialize() {
        this.setupTrainingPrograms();
        this.setupSkillTree();
    }

    // Staff Management
    hireStaff(staffMember) {
        if (!this.canHireStaff(staffMember)) return false;
        
        this.staff.set(staffMember.id, {
            ...staffMember,
            level: 1,
            experience: 0,
            skills: new Set(),
            schedule: this.createDefaultSchedule(),
            status: 'available'
        });

        this.updateOfficeStats();
        return true;
    }

    assignStaff(staffId, taskId) {
        const staff = this.staff.get(staffId);
        if (!staff || staff.status !== 'available') return false;

        this.assignments.set(staffId, {
            taskId,
            startTime: Date.now(),
            efficiency: this.calculateEfficiency(staff, taskId)
        });

        staff.status = 'assigned';
        return true;
    }

    updateStaffSchedule(staffId, schedule) {
        const staff = this.staff.get(staffId);
        if (!staff) return false;

        this.schedules.set(staffId, schedule);
        this.updateOfficeEfficiency();
        return true;
    }

    // Training System
    startTraining(staffId, programId) {
        const staff = this.staff.get(staffId);
        const program = this.trainingPrograms.get(programId);
        
        if (!staff || !program || staff.status !== 'available') return false;

        staff.status = 'training';
        this.assignments.set(staffId, {
            type: 'training',
            programId,
            startTime: Date.now(),
            duration: program.duration
        });

        return true;
    }

    completeTraining(staffId) {
        const staff = this.staff.get(staffId);
        const assignment = this.assignments.get(staffId);
        
        if (!staff || !assignment || assignment.type !== 'training') return false;

        const program = this.trainingPrograms.get(assignment.programId);
        program.skills.forEach(skill => staff.skills.add(skill));
        
        staff.status = 'available';
        this.assignments.delete(staffId);
        
        this.updateStaffMember(staff);
        return true;
    }

    // Skill System
    setupSkillTree() {
        // Tax Preparation Skills
        this.addSkill('basic_returns', {
            name: 'Basic Returns',
            description: 'Handle simple tax returns',
            level: 1,
            efficiency: 5
        });

        this.addSkill('itemized_deductions', {
            name: 'Itemized Deductions',
            description: 'Process itemized deductions accurately',
            level: 2,
            efficiency: 8,
            requires: ['basic_returns']
        });

        this.addSkill('business_returns', {
            name: 'Business Returns',
            description: 'Handle business tax returns',
            level: 3,
            efficiency: 12,
            requires: ['itemized_deductions']
        });
    }

    setupTrainingPrograms() {
        this.addTrainingProgram('basic_training', {
            name: 'Basic Tax Training',
            description: 'Essential tax preparation skills',
            duration: 5,
            cost: 1000,
            skills: ['basic_returns'],
            requirements: {}
        });

        this.addTrainingProgram('advanced_deductions', {
            name: 'Advanced Deductions',
            description: 'Master itemized deductions',
            duration: 7,
            cost: 2000,
            skills: ['itemized_deductions'],
            requirements: {
                skills: ['basic_returns']
            }
        });

        this.addTrainingProgram('business_tax_prep', {
            name: 'Business Tax Preparation',
            description: 'Business return preparation',
            duration: 10,
            cost: 3500,
            skills: ['business_returns'],
            requirements: {
                skills: ['itemized_deductions']
            }
        });
    }

    // Helper Methods
    addSkill(id, skillData) {
        this.skills.set(id, skillData);
    }

    addTrainingProgram(id, programData) {
        this.trainingPrograms.set(id, programData);
    }

    canHireStaff(staffMember) {
        // Check budget and requirements
        return true; // Implement actual checks
    }

    createDefaultSchedule() {
        return {
            monday: { start: 9, end: 17 },
            tuesday: { start: 9, end: 17 },
            wednesday: { start: 9, end: 17 },
            thursday: { start: 9, end: 17 },
            friday: { start: 9, end: 17 }
        };
    }

    calculateEfficiency(staff, taskId) {
        let efficiency = staff.stats.efficiency;
        
        // Add skill bonuses
        staff.skills.forEach(skillId => {
            const skill = this.skills.get(skillId);
            if (skill) efficiency += skill.efficiency;
        });

        return efficiency;
    }

    // UI Methods
    createStaffUI() {
        const container = document.createElement('div');
        container.className = 'staff-management';
        
        container.innerHTML = `
            <div class="staff-header">
                <h2>Staff Management</h2>
                <div class="staff-controls">
                    <button class="hire-staff">Hire Staff</button>
                    <button class="manage-training">Training</button>
                    <button class="view-schedule">Schedules</button>
                </div>
            </div>

            <div class="staff-content">
                <div class="staff-list"></div>
                <div class="staff-details"></div>
            </div>

            <div class="training-panel hidden">
                <h3>Training Programs</h3>
                <div class="training-list"></div>
            </div>

            <div class="schedule-panel hidden">
                <h3>Staff Schedules</h3>
                <div class="schedule-calendar"></div>
            </div>
        `;

        this.setupUIHandlers(container);
        return container;
    }

    setupUIHandlers(container) {
        // Hire Staff
        container.querySelector('.hire-staff').addEventListener('click', () => {
            this.showHireStaffDialog();
        });

        // Training Panel
        container.querySelector('.manage-training').addEventListener('click', () => {
            this.togglePanel('.training-panel');
        });

        // Schedule Panel
        container.querySelector('.view-schedule').addEventListener('click', () => {
            this.togglePanel('.schedule-panel');
        });
    }

    showHireStaffDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'hire-staff-dialog';
        
        dialog.innerHTML = `
            <h3>Available Candidates</h3>
            <div class="candidates-list">
                ${this.renderAvailableCandidates()}
            </div>
        `;

        document.querySelector('.staff-management').appendChild(dialog);
    }

    renderAvailableCandidates() {
        return `
            <div class="candidate">
                <div class="candidate-info">
                    <h4>Tax Assistant</h4>
                    <p>Entry-level tax preparation</p>
                    <ul>
                        <li>Basic returns</li>
                        <li>Data entry</li>
                        <li>Client support</li>
                    </ul>
                </div>
                <div class="candidate-stats">
                    <div>Efficiency: 5</div>
                    <div>Cost: $2000</div>
                </div>
                <button class="hire-button" data-type="assistant">Hire</button>
            </div>

            <div class="candidate">
                <div class="candidate-info">
                    <h4>Tax Specialist</h4>
                    <p>Experienced in handling audits</p>
                    <ul>
                        <li>Complex returns</li>
                        <li>Audit defense</li>
                        <li>Tax planning</li>
                    </ul>
                </div>
                <div class="candidate-stats">
                    <div>Efficiency: 8</div>
                    <div>Cost: $4000</div>
                </div>
                <button class="hire-button" data-type="specialist">Hire</button>
            </div>
        `;
    }

    togglePanel(panelSelector) {
        const panel = document.querySelector(panelSelector);
        const wasHidden = panel.classList.contains('hidden');
        
        // Hide all panels
        document.querySelectorAll('.training-panel, .schedule-panel')
            .forEach(p => p.classList.add('hidden'));
        
        // Show selected panel if it was hidden
        if (wasHidden) {
            panel.classList.remove('hidden');
            if (panelSelector === '.training-panel') {
                this.updateTrainingPanel();
            } else if (panelSelector === '.schedule-panel') {
                this.updateSchedulePanel();
            }
        }
    }
}

export { StaffManagementSystem };
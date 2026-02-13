"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, Building2, Briefcase, Pencil, Trash2 } from "lucide-react";

export default function ProjectsList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [appliedProjectIds, setAppliedProjectIds] = useState<Set<string>>(new Set());

    const [isAdmin, setIsAdmin] = useState(false); // Demo Admin Toggle
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Filter States
    const [filterProjectType, setFilterProjectType] = useState('All');
    const [filterWorkType, setFilterWorkType] = useState('All');
    const [filterCompany, setFilterCompany] = useState('All');
    const [filterRole, setFilterRole] = useState('All'); // For 'Work' label
    const [filterLocation, setFilterLocation] = useState('All'); // For 'State' label

    // Filter Options
    const projectTypeOptions = [
        "All",
        "Commercial Building",
        "Food Manufacturing Product",
        "Industrial Building",
        "Industrial Manufacturing Facilities",
        "Residential",
        "Warehouse"
    ];

    const workTypeOptions = [
        "All",
        "Labour Supply",
        "Measurement Basis"
    ];

    // Derive unique options from projects
    const companyOptions = ["All", ...Array.from(new Set(projects.map((p: any) => p.company))).sort()];
    const roleOptions = ["All", ...Array.from(new Set(projects.map((p: any) => p.role))).sort()]; // Maps to 'Work'
    const locationOptions = ["All", ...Array.from(new Set(projects.map((p: any) => p.location))).sort()]; // Maps to 'State'

    const [newProject, setNewProject] = useState({
        role: '',
        company: '',
        location: '',
        subtitle: '',
        rate: '',
        workers: 0,
        projectType: '',
        workType: '',
        tags: '',
        isUrgent: false
    });

    const handleEditClick = (project: any) => {
        setEditingProject(project);
        setNewProject({
            role: project.role,
            company: project.company,
            location: project.location,
            subtitle: project.subtitle || '',
            rate: project.rate,
            workers: project.workers,
            projectType: project.projectType,
            workType: project.workType,
            tags: project.tags.join(', '),
            isUrgent: project.tags.includes('Urgent hiring')
        });
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProject = async (projectId: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    alert('Project deleted successfully!');
                    const projectsRes = await fetch('http://localhost:5000/api/projects');
                    const projectsData = await projectsRes.json();
                    setProjects(projectsData);
                } else {
                    alert('Failed to delete project');
                }
            } catch (error) {
                console.error(error);
                alert('Error deleting project');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProject((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProject((prev: any) => ({ ...prev, isUrgent: e.target.checked }));
    };

    // Combined Form Submit Handler
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const tagsArray = newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            if (newProject.isUrgent && !tagsArray.includes('Urgent hiring')) tagsArray.push('Urgent hiring');

            const payload = {
                ...newProject,
                tags: tagsArray
            };

            let url = 'http://localhost:5000/api/projects/add';
            let method = 'POST';

            if (editingProject) {
                url = `http://localhost:5000/api/projects/${editingProject._id}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
                setShowAddForm(false);
                setEditingProject(null);
                setNewProject({
                    role: '', company: '', location: '', subtitle: '', rate: '', workers: 0, projectType: '', workType: '', tags: '', isUrgent: false
                });
                const projectsRes = await fetch('http://localhost:5000/api/projects');
                const projectsData = await projectsRes.json();
                setProjects(projectsData);
            } else {
                alert(editingProject ? 'Failed to update project' : 'Failed to add project');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting project');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Projects
                const projectsRes = await fetch('http://localhost:5000/api/projects');
                const projectsData = await projectsRes.json();
                setProjects(projectsData);

                // Fetch User Applications & Profile (if logged in)
                const token = localStorage.getItem('token') || localStorage.getItem('workerToken') || localStorage.getItem('customerToken');

                if (token) {
                    try {
                        const applicationsRes = await fetch('http://localhost:5000/api/worker/applications', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (applicationsRes.ok) {
                            const applicationsData = await applicationsRes.json();
                            const ids = new Set(applicationsData.map((app: any) => app.project?._id || app.project));
                            setAppliedProjectIds(ids as Set<string>);
                        }
                    } catch (e) { }

                    const profileRes = await fetch('http://localhost:5000/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        if (profileData.isAdmin) {
                            setIsAdmin(true);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = async (projectId: string) => {
        const token = localStorage.getItem('workerToken');
        if (!token) {
            alert('Please login as a worker to apply for projects.');
            return;
        }

        setApplying(projectId);
        try {
            const res = await fetch('http://localhost:5000/api/projects/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ projectId }),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Application submitted successfully!');
                setAppliedProjectIds(prev => new Set(prev).add(projectId));
            } else {
                alert(data.message || 'Failed to apply');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setApplying(null);
        }
    };

    if (loading) return <div className="py-8 text-center text-gray-500">Loading Projects...</div>;

    return (
        <div className="py-8 bg-gray-50">
            <div className="container mx-auto px-4 md:px-32">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Your Next Big Project Starts Here
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        Digital Labour Chowk brings to you a curated list of verified and active construction projects from across India. Explore opportunities based on your expertise, workforce strength, and region.
                    </p>
                </div>

                {/* How to Apply Section */}
                <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">How to Apply (Step-by-Step):</h2>
                        <ul className="space-y-3 mb-8">
                            {[
                                "Use Filters to shortlist projects as per your interest",
                                "Explore Project Details like rate, location, and worker requirements",
                                "Select One or More Projects you want to work on",
                                "Fill the Form Below to submit your interest – our team will connect you with the project PoC"
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 shrink-0" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
                            {[
                                { name: 'PITCS', url: 'https://logo.clearbit.com/pitcs.in' },
                                { name: 'Ramoji Film City', url: 'https://logo.clearbit.com/ramojifilmcity.com' },
                                { name: 'GPS Renewables', url: 'https://logo.clearbit.com/gpsrenewables.com' },
                                { name: 'Sumadhura', url: 'https://logo.clearbit.com/sumadhuragroup.com' },
                                { name: 'Sobha Realty', url: 'https://logo.clearbit.com/sobharealty.com' },
                                { name: 'L&T', url: 'https://logo.clearbit.com/larsentoubro.com' }
                            ].map((partner) => (
                                <img
                                    key={partner.name}
                                    src={partner.url}
                                    alt={partner.name}
                                    className="h-12 w-auto object-contain mix-blend-multiply"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="hidden lg:block relative h-64 w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img
                            src="https://img.freepik.com/free-vector/construction-site-concept-illustration_114360-2212.jpg"
                            alt="How to Apply"
                            className="w-full h-full object-cover mix-blend-multiply opacity-80"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-xl text-gray-900">Filters</h3>
                        </div>
                        <button
                            onClick={() => {
                                if (showAddForm) {
                                    setShowAddForm(false);
                                    setEditingProject(null);
                                    setNewProject({
                                        role: '', company: '', location: '', subtitle: '', rate: '', workers: 0, projectType: '', workType: '', tags: '', isUrgent: false
                                    });
                                } else {
                                    setShowAddForm(true);
                                }
                            }}
                            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                        >
                            {showAddForm ? 'Cancel' : '+ Add New Project'}
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-lg font-bold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="role" placeholder="Role (e.g. Civil Contractor)" value={newProject.role} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="text" name="company" placeholder="Company Name" value={newProject.company} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="text" name="location" placeholder="Location" value={newProject.location} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="text" name="subtitle" placeholder="Subtitle (e.g. Tricon) - Optional" value={newProject.subtitle} onChange={handleInputChange} className="p-2 border rounded-lg" />
                                <input type="text" name="rate" placeholder="Rate (e.g. ₹33,000/month)" value={newProject.rate} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="number" name="workers" placeholder="Workers Required" value={newProject.workers} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="text" name="projectType" placeholder="Project Type (e.g. Residential)" value={newProject.projectType} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="text" name="workType" placeholder="Work Type (e.g. Labour Supply)" value={newProject.workType} onChange={handleInputChange} className="p-2 border rounded-lg" required />
                                <input type="text" name="tags" placeholder="Tags (comma separated)" value={newProject.tags} onChange={handleInputChange} className="p-2 border rounded-lg" />

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="urgent" checked={newProject.isUrgent} onChange={handleCheckboxChange} className="w-4 h-4" />
                                    <label htmlFor="urgent" className="text-sm font-medium">Urgent Hiring</label>
                                </div>

                                <div className="md:col-span-2">
                                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">
                                        {editingProject ? 'Update Project' : 'Submit Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {['Project type', 'Work type', 'Company', 'Work', 'State'].map((label) => (
                            <div key={label}>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-[#E5E7EB] border-transparent rounded-lg text-sm px-4 py-2.5 text-gray-700 focus:bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none cursor-pointer transition-all font-medium"
                                        value={
                                            label === 'Project type' ? filterProjectType :
                                                label === 'Work type' ? filterWorkType :
                                                    label === 'Company' ? filterCompany :
                                                        label === 'Work' ? filterRole :
                                                            label === 'State' ? filterLocation :
                                                                'All'
                                        }
                                        onChange={(e) => {
                                            if (label === 'Project type') setFilterProjectType(e.target.value);
                                            if (label === 'Work type') setFilterWorkType(e.target.value);
                                            if (label === 'Company') setFilterCompany(e.target.value);
                                            if (label === 'Work') setFilterRole(e.target.value);
                                            if (label === 'State') setFilterLocation(e.target.value);
                                        }}
                                    >
                                        {label === 'Project type' ? (
                                            projectTypeOptions.map(option => <option key={option} value={option}>{option}</option>)
                                        ) : label === 'Work type' ? (
                                            workTypeOptions.map(option => <option key={option} value={option}>{option}</option>)
                                        ) : label === 'Company' ? (
                                            companyOptions.map((option: any) => <option key={option} value={option}>{option}</option>)
                                        ) : label === 'Work' ? (
                                            roleOptions.map((option: any) => <option key={option} value={option}>{option}</option>)
                                        ) : label === 'State' ? (
                                            locationOptions.map((option: any) => <option key={option} value={option}>{option}</option>)
                                        ) : (
                                            <option>All</option>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.filter((project: any) => {
                        const matchesType = filterProjectType === 'All' || project.projectType === filterProjectType;
                        const matchesWorkType = filterWorkType === 'All' || project.workType === filterWorkType;
                        const matchesCompany = filterCompany === 'All' || project.company === filterCompany;
                        const matchesRole = filterRole === 'All' || project.role === filterRole;
                        const matchesLocation = filterLocation === 'All' || project.location === filterLocation;

                        return matchesType && matchesWorkType && matchesCompany && matchesRole && matchesLocation;
                    }).map((project: any, idx) => {
                        const isUrgent = project.tags.includes("Urgent hiring");
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6 flex flex-col items-start relative group"
                            >
                                {/* Admin Edit/Delete Icons - Only visible to admin */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(project)}
                                            className="bg-gray-100 p-2 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                            title="Edit Project"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project._id)}
                                            className="bg-gray-100 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-between items-start w-full mb-2">
                                    <div className="flex gap-2 mb-2">
                                        {isUrgent && (
                                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                Urgent hiring
                                            </span>
                                        )}
                                        {project.tags
                                            .filter((t: string) => t !== "Urgent hiring")
                                            .map((tag: string, i: number) => (
                                                <span key={i} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">
                                    {project.role}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-4">
                                    {project.company} {project.subtitle && <span className="text-gray-400"> • {project.subtitle}</span>}
                                </p>

                                <div className="space-y-3 w-full mb-6">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <MapPin className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                                        {project.location}
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Briefcase className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                                        {project.rate}
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Users className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                                        {project.workers} Workers Required
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Building2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                                        {project.projectType} • {project.workType}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleApply(project._id)}
                                    disabled={appliedProjectIds.has(project._id) || applying === project._id}
                                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${appliedProjectIds.has(project._id)
                                            ? "bg-green-100 text-green-700 cursor-default"
                                            : "bg-black text-white hover:bg-gray-800"
                                        }`}
                                >
                                    {appliedProjectIds.has(project._id)
                                        ? "Applied"
                                        : applying === project._id
                                            ? "Applying..."
                                            : "Apply Now"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

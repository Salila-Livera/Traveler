import React, { useState, useEffect } from "react";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../services/planApi";
import Modal from "react-modal";
import "./PlansPage.css";
Modal.setAppElement("#root");

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    localStorage.setItem("userId", 1);
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPlans();
      setPlans(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch plans. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentPlan({
      topic: "",
      resources: [""],
      timeline: 30,
      description: "",
      steps: [""],
      user: { id: userId },
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setCurrentPlan({
      ...plan,
      resources: [...plan.resources],
      steps: [...plan.steps],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(id);
        fetchPlans();
      } catch (err) {
        console.error("Failed to delete plan:", err);
        setError("Failed to delete plan. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPlan.id) {
        await updatePlan(currentPlan.id, currentPlan);
      } else {
        await createPlan(currentPlan);
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);
      setError("Failed to save plan. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPlan({ ...currentPlan, [name]: value });
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...currentPlan.resources];
    newResources[index] = value;
    setCurrentPlan({ ...currentPlan, resources: newResources });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...currentPlan.steps];
    newSteps[index] = value;
    setCurrentPlan({ ...currentPlan, steps: newSteps });
  };

  const addResource = () => {
    setCurrentPlan({
      ...currentPlan,
      resources: [...currentPlan.resources, ""],
    });
  };

  const addStep = () => {
    setCurrentPlan({
      ...currentPlan,
      steps: [...currentPlan.steps, ""],
    });
  };

  const removeResource = (index) => {
    const newResources = currentPlan.resources.filter((_, i) => i !== index);
    setCurrentPlan({ ...currentPlan, resources: newResources });
  };

  const removeStep = (index) => {
    const newSteps = currentPlan.steps.filter((_, i) => i !== index);
    setCurrentPlan({ ...currentPlan, steps: newSteps });
  };

  if (isLoading) {
    return <div className="empty-state">Loading plans...</div>;
  }

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  return (
    <div className="plans-container">
      <div className="plans-header">
        <h1>Learning Plans</h1>
        {userId && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Create New Plan
          </button>
        )}
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <p>No learning plans found.</p>
          {userId && (
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Your First Plan
            </button>
          )}
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.topic}</h3>
              <div className="plan-meta">
                <span>{plan.timeline} minutes</span>
                <span>By User #{plan.user.id}</span>
              </div>
              <p>{plan.description}</p>
              {userId && userId == plan.user.id && (
                <div className="plan-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(plan)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{currentPlan?.id ? "Edit Plan" : "Create New Plan"}</h2>
          <button className="close-btn" onClick={() => setIsModalOpen(false)}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <input
              type="text"
              id="topic"
              name="topic"
              className="form-control"
              value={currentPlan?.topic || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={currentPlan?.description || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeline">Timeline (minutes)</label>
            <input
              type="number"
              id="timeline"
              name="timeline"
              className="form-control"
              min="1"
              value={currentPlan?.timeline || 30}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Resources</label>
            <div className="resources-list">
              {currentPlan?.resources.map((resource, index) => (
                <div key={index} className="list-item">
                  <input
                    type="text"
                    className="form-control"
                    value={resource}
                    onChange={(e) =>
                      handleResourceChange(index, e.target.value)
                    }
                    required
                  />
                  {currentPlan.resources.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeResource(index)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary add-item-btn"
              onClick={addResource}
            >
              Add Resource
            </button>
          </div>

          <div className="form-group">
            <label>Steps</label>
            <div className="steps-list">
              {currentPlan?.steps.map((step, index) => (
                <div key={index} className="list-item">
                  <input
                    type="text"
                    className="form-control"
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    required
                  />
                  {currentPlan.steps.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeStep(index)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary add-item-btn"
              onClick={addStep}
            >
              Add Step
            </button>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentPlan?.id ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlansPage;

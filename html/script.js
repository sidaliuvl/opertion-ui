* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  user-select: none;
  background: transparent;
  font-weight: 400;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 5;
  display: none;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

#operation-ui {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background: linear-gradient(145deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.98) 50%, 
    rgba(15, 23, 42, 0.98) 100%);
  color: #f8fafc;
  border-radius: 12px;
  padding: 0;
  z-index: 10;
  display: none;
  box-shadow: 
    0 20px 40px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(148, 163, 184, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  pointer-events: auto;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#header {
  background: linear-gradient(135deg, 
    rgba(30, 58, 138, 0.9) 0%, 
    rgba(59, 130, 246, 0.8) 50%, 
    rgba(30, 58, 138, 0.9) 100%);
  padding: 12px 16px;
  cursor: move;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.header-icon {
  font-size: 14px;
  color: #60a5fa;
  filter: drop-shadow(0 0 6px rgba(96, 165, 250, 0.4));
}

#op-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.025em;
}

.status-indicator {
  display: flex;
  align-items: center;
}

.status-indicator i {
  font-size: 6px;
  color: #10b981;
  animation: pulse 2s infinite;
  filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.6));
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.ui-content {
  padding: 0;
}

#member-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 12px;
  margin: 0;
}

#member-list::-webkit-scrollbar {
  width: 4px;
}

#member-list::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 2px;
}

#member-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(30, 58, 138, 0.6));
  border-radius: 2px;
  transition: background 0.2s ease;
}

.member {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.member-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
}

.member-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.6);
}

.member.over-limit {
    rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fecaca;
}

.member.over-limit .member-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  opacity: 0.5;
}

.member.over-limit:hover .member-icon {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  opacity: 1;
}

.member-info {
  flex: 1;
  min-width: 0;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.member:hover .member-info {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.member-name {
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-rank {
  font-size: 10px;
  color: rgba(148, 163, 184, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.member-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: #10b981;
  margin-top: 1px;
}

.member-status i {
  font-size: 6px;
}

.operation-stats {
  padding: 12px 16px;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.8) 0%, 
    rgba(30, 41, 59, 0.6) 100%);
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.stat-item i {
  font-size: 12px;
  color: #60a5fa;
  margin-bottom: 2px;
}

.stat-item span {
  font-size: 11px;
  font-weight: 500;
  color: #e2e8f0;
}

.status-text {
  color: #10b981 !important;
  font-weight: 600 !important;
}

#leave-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: none;
  color: white;
  padding: 12px 16px;
  width: 100%;
  font-size: 12px;
  font-weight: 600;
  border-radius: 0 0 12px 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

#leave-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(220, 38, 38, 0.4);
}

#leave-btn:active {
  transform: translateY(0);
}

#leave-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

#leave-btn i {
  font-size: 12px;
  transition: transform 0.2s ease;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: rgba(148, 163, 184, 0.6);
}

.empty-state-icon {
  font-size: 32px;
  color: rgba(59, 130, 246, 0.3);
  margin-bottom: 12px;
  display: block;
}

.empty-state-text {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

.empty-state-subtext {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.4);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  #operation-ui {
    width: calc(100vw - 40px);
    left: 20px;
    transform: none;
    max-width: 280px;
  }
  
  .operation-stats {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .stat-item:last-child {
    grid-column: 1 / -1;
  }
}

/* Animation for showing/hiding */
#operation-ui.show {
  animation: slideInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

#operation-ui.hide {
  animation: slideOutScale 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes slideOutScale {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.95);
  }
}

/* Loading animation */
.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
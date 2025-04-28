import React from 'react'

export default function Toast(props) {
    const { showToast, message } = props
    return (
        <div className="toast-container position-fixed top-0 end-0 p-0">
            <div
                className={`toast ${showToast ? 'show' : ''}`}
            >
                <div className="toast-body p-0">
                    {message}
                </div>
            </div>
        </div>
    )
}

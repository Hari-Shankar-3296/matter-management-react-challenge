import Modal from './Modal';


interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDanger?: boolean;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDanger = false,
}: ConfirmationModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="confirmation-content" style={{ padding: '1.5rem' }}>
                <pre style={{
                    marginBottom: '1.5rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap',
                    textAlign: 'center'
                }}>
                    {message}
                </pre>
                <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: 20, paddingTop: 0, borderTop: 'none' }}>
                    <button className="btn btn-secondary" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;

import {React, useState} from "react"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function FileModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                ファイル
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ファイルを選択してください</Modal.Title>
                </Modal.Header>
                <Modal.Body>ファイルは複数選択できます。<br/>アップロード後、画像処理をおこないます。<br/>処理は時間がかかります。</Modal.Body>

                <form action={process.env.REACT_APP_API_URI + "/uploadfiles/"} encType="multipart/form-data" method="post">
                    <input name="files" type="file" multiple/>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose} type="submit">
                            send
                        </Button>
                    </Modal.Footer>

                </form>
            </Modal>
        </>
    );
}
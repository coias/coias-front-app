import {React, useEffect, useState} from "react"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios';

export default function FileModal() {

    const [value, setValue] = useState("");
    const [show, setShow] = useState(false);
    const [valid, setValid] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = (e) => {
        const data = new FormData();
        data.append(value);
        
        axios.post(process.env.REACT_APP_API_URI, data)
        .then(function (response) {
            // 送信成功時の処理
            handleClose()
        })
        .catch(function (error) {
            // 送信失敗時の処理
            console.log(error);
        });

        e.preventDefault()
    }

    const handleChange = (e) => {
        //ファイル変更時
        if (e.target.value !== ""){
            setValid(false)
            setValue(e.target.value)
        }else{
            setValid(true)
        }
    }

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                ファイル
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ファイルを選択してください</Modal.Title>
                </Modal.Header>
                <Modal.Body>アップロード後、画像処理をおこないます。<br/>処理は時間がかかります。</Modal.Body>

                <Form onSubmit={handleSubmit} controlId="formFile" className="mb-3">
                    <InputGroup hasValidation>
                        <Form.Control type="file" onChange={handleChange} isInvalid={valid} multiple/>
                        <Form.Control.Feedback type="invalid">
                            ファイルを選択してください。ファイルは複数選択できます。
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose} type="submit">
                                send
                            </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
import "./SearchBox.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : `/search`);
    };

    return (
        <Form className="search" onSubmit={submitHandler}>
            <InputGroup>
                <FormControl
                    type="text"
                    name="keyword"
                    id="keyword"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm"
                    aria-label="Tìm kiếm sản phẩm"
                    aria-describedby="button-search"
                    required
                    >
                </FormControl>
                <Button className="btn btn-primary" type="submit" id="button-search">
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                </Button>
            </InputGroup>
        </Form>
    )
}
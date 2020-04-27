import React from "react"
import { Col, Container, Row } from "reactstrap"

export default () => {
    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ marginTop: "-100px" }}
        >
            <div>
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3">Oops! You&apos;re lost.</h4>
                <p className="text-muted float-left">
                    The page you are looking for was not found.
                </p>
            </div>
        </div>
    )
}

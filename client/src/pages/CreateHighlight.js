import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";

import history from "../config/history";
import BackBtn from "../components/buttons/BackBtn";
import EditHighlight from "../components/Admin/EditHighlight";
import ViewHighlight from "../components/ViewHighlight";
import { getHighlight, createOrUpdateHighlight } from "../utils/api/fetchData";
import renderNoti from "../utils/renderNoti";

const CreateHighlight = (props) => {
    const {
        match: {
            params: { id },
        },
    } = props;

    const canEdit = props.role === "admin";

    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            getHighlight(id).then((res) => setData(res.data));
        }
    }, []);

    const onTitleChange = (e) =>
        setData({
            ...data,
            title: e.target.value,
        });

    const onEditorChange = (e) => {
        setData({
            ...data,
            content: e.editor.getData(),
        });
    };

    const onSubmit = async () => {
        try {
            if (!data || !data.title.trim() || !data.content.trim()) {
                throw new Error(
                    `${id ? "Update" : "Create"}  highlights failed`
                );
            }

            if (id) {
                data.id = id;
            }

            const res = await createOrUpdateHighlight(data);
            if (res.data !== true) {
                throw new Error(
                    `${id ? "Update" : "Create"}  highlights failed`
                );
            }

            renderNoti({
                type: "success",
                title: "Success",
                message: `${id ? "Update" : "Create"}  highlights successfully`,
            });

            history.push("/");
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Failed",
                message: err.message,
            });
        }
    };

    return (
        <>
            <Row className="mb-2">
                <Col md={canEdit ? 4 : 8}>
                    <h5>
                        {!id
                            ? "Create highlight"
                            : canEdit
                            ? "Edit highlight"
                            : "Highlight"}
                    </h5>
                </Col>
                <Col md={4} className="text-right">
                    <BackBtn title="home" onClick={() => history.push("/")} />
                </Col>
            </Row>
            {canEdit ? (
                <EditHighlight
                    data={data}
                    onTitleChange={onTitleChange}
                    onEditorChange={onEditorChange}
                />
            ) : (
                <ViewHighlight data={data} />
            )}
            {canEdit && (
                <Row>
                    <Col md={8} sm={12} className="text-right">
                        <Button
                            color="success"
                            className="mr-2"
                            onClick={onSubmit}
                        >
                            {id ? "Update" : "Create"}
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => history.push("/")}
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    role: state.user.userInformation.role,
});

export default connect(mapStateToProps, null)(CreateHighlight);

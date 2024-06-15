import React from "react";
import Chart from "chart.js/auto";
import { Doughnut, Pie } from "react-chartjs-2";
import autocolors from "chartjs-plugin-autocolors";

export default function GoogleFiles(props) {
    const [sectionLabel, setSectionLabel] = React.useState(
        "Google File Data Tracker",
    );

    const [file, setFile] = React.useState({
        fileURL: "",
        fileType: "",
        fileId: "",
        displayType: "",
        dataQuestionId: "",
        dataTitle: "",
        initialRender: false,
    });

    const [dataOptions, setDataOptions] = React.useState([]);

    const [chartOptions, setChartOptions] = React.useState({
        displayTitle: true,
        title: "CALA Team Responses",
    });

    const [fetchedData, setFetchedData] = React.useState([]);

    const [data, setData] = React.useState("");
    const [formattedData, setFormattedData] = React.useState("");

    const [googleData, setGoogleData] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const [useLink, setUseLink] = React.useState(false);

    const [dataToSet, setDataToSet] = React.useState({
        options: false,
        formatted: false,
    });

    const dataDisplayOptions = [
        "Bar",
        "Bubble",
        "Doughnut",
        "Line",
        "Pie",
        "Radar",
        "Response Counter",
        "Value Counter",
    ];

    const options = {
        plugins: {
            title: {
                display: true,
                text: file.dataTitle ? file.dataTitle : "Placeholder Title",
                font: {
                    size: 14,
                },
            },
            legend: {
                labels: {
                    boxHeight: 6,
                    padding: 3,
                },
            },
            autocolors: {
                mode: "data",
            },
        },
        layout: {
            padding: {
                top: 5,
                right: 0,
                bottom: 15,
                left: 20,
            },
        },
    };

    Chart.defaults.color = "white";
    Chart.defaults.font.size = 12;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.overrides.pie.plugins.legend.position = "right";
    Chart.register(autocolors);

    // Fetches initial data from local db
    React.useEffect(() => {
        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/google/section/${props.sectionID}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    setFile((prevFile) => ({
                        ...prevFile,
                        fileURL: data[0].v_google_id,
                        fileType: data[0].v_type,
                        fileId: data[0].v_google_id,
                        displayType: data[0].v_display_type,
                        dataQuestionId: data[0].v_question_id,
                        dataTitle: data[0].v_title,
                        initialRender: true,
                    }));
                }
            })
            .catch((error) => console.log(error));
    }, []);

    // Fetches display options and populates label options
    React.useEffect(() => {
        if (file.initialRender) {
            setFile({
                ...file,
                initalRender: false,
            });

            setDataToSet({
                ...dataToSet,
                formatted: true,
            });

            getGoogleData(
                `/${file.fileId}/question_responses/${file.dataQuestionId}/respondent/none`,
            );
        }
    }, [file.initialRender]);

    React.useEffect(() => {
        if (useLink) {
            setDataToSet({
                ...dataToSet,
                options: true,
            });
            getGoogleData(`/${file.fileId}/questions`);
        }
    }, [useLink]);

    React.useEffect(() => {
        if (dataToSet.options) {
            setDataOptions(fetchedData);
            setDataToSet({
                ...dataToSet,
                options: false,
            });
        } else if (dataToSet.formatted) {
            setData(fetchedData);
            setDataToSet({
                ...dataToSet,
                formatted: false,
            });
        }
    }, [fetchedData]);

    React.useEffect(() => {
        formatGoogleData();
    }, [data]);

    React.useEffect(() => {
        if (data !== "") {
            formatGoogleData();
        }
    }, [data]);

    // GET Request - Requests general GET requests
    async function getGoogleData(queryUrl) {
        setLoading(true);
        return await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/google${queryUrl}`,
        )
            .then((response) => response.json())
            .then((data) => {
                setFetchedData(data);
            })
            .catch((error) => console.log(error))
            .finally(setLoading(false));
    }

    function handleClick() {
        try {
            setFile({
                ...file,
                fileType: file.fileURL
                    .split("docs.google.com/")[1]
                    .split("/d/")[0],
                fileId: file.fileURL.split("/d/")[1].split("/edit")[0],
            });
        } catch (error) {
            setFile({
                ...file,
                fileURL: file.fileId,
            });
        }

        setUseLink(true);
    }

    async function saveChanges() {
        await Promise.all([
            getGoogleData(
                `/${file.fileId}/question_responses/${file.dataQuestionId}/respondent/none`,
            ),
            props.saveData(
                `/google/${props.sectionID}/file/${file.fileId}/type/${file.fileType}`,
            ),
            props.saveData(
                `/google/${props.sectionID}/file/${file.fileId}/display/${file.displayType}`,
            ),
            props.saveData(
                `/google/${props.sectionID}/file/${file.fileId}/question/${file.dataQuestionId}/title/${file.dataTitle}`,
            ),
        ]);

        setDataToSet({
            ...dataToSet,
            formatted: true,
        });
    }

    function formatGoogleData() {
        switch (file.fileType) {
            case "forms":
                const dataPoints = data.map((data) => data.answers.value);

                const values = {};

                dataPoints.forEach((value) => {
                    values[value] = (values[value] || 0) + 1;
                });

                setFormattedData({
                    labels: Object.keys(values),
                    datasets: [
                        {
                            label: "Title",
                            data: Object.values(values),
                            hoverOffset: 10,
                            borderWidth: 2,
                            axis: "y",
                        },
                    ],
                });
        }
    }

    React.useEffect(() => {
        if (formattedData) {
            if (!file.fileId) {
                setGoogleData(
                    <div className="data-display-prompt">
                        Track a new file by adding a google file <br /> link in
                        the editor!
                    </div>,
                );
            } else {
                setGoogleData(
                    <Pie
                        options={options}
                        className="data-chart"
                        data={formattedData}
                    />,
                );
            }
        } else {
            setGoogleData(
                <div className="data-display-prompt">
                    Track a new file by adding a google file <br /> link in the
                    editor!
                </div>,
            );
        }
    }, [formattedData]);

    function handleDisplayTypeChange(event) {
        setFile({ ...file, displayType: event.target.value });
    }

    function handleQuestionOptionChange(event) {
        setFile({
            ...file,
            dataQuestionId: event.target.value,
            dataTitle: event.target.title,
        });
    }

    const dataDisplayOptionsRender = dataDisplayOptions.map((option) => {
        return (
            <label className="data-display-options-label">
                <input
                    className="data-display-options-radio"
                    type="radio"
                    name="dataOptions"
                    value={option}
                    checked={file.displayType === option}
                    onChange={handleDisplayTypeChange}
                />
                {option}
            </label>
        );
    });

    const dataLabelOptionsRender = dataOptions.map((option) => {
        return (
            <label className="data-options-label">
                <input
                    className="data-options-radio"
                    type="radio"
                    name="dataQuestionOptions"
                    value={option.questionId}
                    title={option.title}
                    checked={file.dataQuestionId === option.questionId}
                    onChange={handleQuestionOptionChange}
                />
                {option.title}
            </label>
        );
    });

    return (
        <div className="label-div">
            <label htmlFor="google-data-div">{sectionLabel}</label>
            <div id="google-data-div" className="google-data-div">
                {props.editable && (
                    <div id="google-file-section-editor">
                        <div id="google-file-url-div">
                            <p>Google File URL or ID</p>
                            <input
                                type="text"
                                className="google-files-input"
                                name="Google File URL"
                                value={file.fileURL}
                                onChange={(event) =>
                                    setFile({
                                        ...file,
                                        fileURL: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <button
                            id="use-file-button"
                            onClick={() => handleClick()}
                        >
                            USE FILE
                        </button>
                        <div className="data-display-options">
                            {dataDisplayOptionsRender}
                        </div>
                        <div className="data-label-options">
                            {dataLabelOptionsRender}
                        </div>
                        <button
                            id="save-file-options-button"
                            onClick={() => saveChanges()}
                        >
                            SAVE
                        </button>
                    </div>
                )}
                {googleData}
            </div>
        </div>
    );
}

import React, { useRef } from "react";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import authHeader from "../../utils/authHeader";
import EventBus from "../../utils/EventBus";

import Chart from "chart.js/auto";
import { Bar, Bubble, Doughnut, Line, Pie, Radar } from "react-chartjs-2";
import autocolors from "chartjs-plugin-autocolors";

import { socket } from "../../App";

export default function GoogleFiles(props) {
    const [label, setLabel] = React.useState("Google File Data Tracker");

    const [file, setFile] = React.useState({
        fileURL: "",
        fileType: "",
        fileId: "",
        displayType: "",
        dataQuestionId: "",
        dataTitle: "",
        afterInitialRender: false,
    });

    const [useAsLink, setUseAsLink] = React.useState(false);

    const [questionsData, setQuestionsData] = React.useState("");
    const [responsesData, setResponsesData] = React.useState("");

    const [chartedData, setChartedData] = React.useState("");

    const [displayedData, setDisplayedData] = React.useState([]);

    const [userInputed, setUserInputed] = React.useState(false);

    const clickRef = useRef(null);
    const [labelToInput, setLabelToInput] = React.useState(false);

    const [loading, setLoading] = React.useState(false);

    const { userId } = useParams();

    const dataDisplayOptions = [
        "Bar Chart",
        "Bubble Chart",
        "Doughnut Chart",
        "Line Chart",
        "Pie Chart",
        "Radar Chart",
        "Response Counter",
        "Response List",
        "Value Counter",
    ];

    const [selectedValue, setSelectedValue] = React.useState({
        displayOption: dataDisplayOptions[0],
        trackedDataQuestionId: "",
        trackedDataTitle: "",
    });

    const options = {
        plugins: {
            title: {
                display: true,
                text: file.dataTitle ? file.dataTitle : "Placeholder Title",
                font: {
                    size: 14,
                },
                padding: 0,
            },
            subtitle: {
                display: true,
                text: `Responses: ${responsesData.length + 1}`,
                font: {
                    size: 12,
                },
                padding: {
                    bottom: 10,
                },
            },
            legend: {
                labels: {
                    boxHeight: 6,
                    padding: 3,
                    boxWidth: 20,
                },
            },
            autocolors: {
                mode: "data",
            },
        },
        layout: {
            padding: {
                top: 18,
                right: 20,
                bottom: 18,
                left: 20,
            },
        },
    };

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: file.dataTitle ? file.dataTitle : "Placeholder Title",
                font: {
                    size: 14,
                },
                padding: 0,
            },
            subtitle: {
                display: true,
                text: `Responses: ${responsesData.length + 1}`,
                font: {
                    size: 12,
                },
                padding: {
                    bottom: 10,
                },
            },
            legend: {
                labels: {
                    boxHeight: 6,
                    padding: 3,
                    boxWidth: 20,
                },
            },
            autocolors: {
                mode: "data",
            },
        },
        layout: {
            padding: {
                top: 18,
                right: 20,
                bottom: 18,
                left: 20,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                ticks: {
                    callback: function (value, index, ticks_array) {
                        let characterLimit = 10;
                        let label = this.getLabelForValue(value);
                        if (label.length >= characterLimit) {
                            return (
                                label
                                    .slice(0, label.length)
                                    .substring(0, characterLimit - 1)
                                    .trim() + "..."
                            );
                        }
                        return label;
                    },
                },
            },
        },
    };

    Chart.defaults.color = "white";
    Chart.defaults.font.size = 12;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    Chart.overrides.pie.plugins.legend.position = "right";
    Chart.overrides.pie.plugins.legend.maxWidth = 100;

    Chart.overrides.doughnut.plugins.legend.position = "right";
    Chart.overrides.doughnut.plugins.legend.maxWidth = 100;

    Chart.register(autocolors);

    // Fetches initial data from local db
    React.useEffect(() => {
        props.setStatusBar("Retrieving data...");

        api.get(`/${userId}/google/section/${props.sectionID}`)
            .then((response) => {
                if (response.data.length > 0) {
                    setFile((prevFile) => ({
                        ...prevFile,
                        fileURL: response.data[0].v_google_id,
                        fileType: response.data[0].v_type,
                        fileId: response.data[0].v_google_id,
                        displayType: response.data[0].v_display_type,
                        dataQuestionId: response.data[0].v_question_id,
                        dataTitle: response.data[0].v_title,
                        afterInitialRender: true,
                    }));
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else {
                    console.log(error);
                }
            });

        api.get(`/${userId}/sections/id/${props.sectionID}`)
            .then((response) => {
                if (response.data[0].v_sec_label) {
                    setLabel(response.data[0].v_sec_label);
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else {
                    console.log(error);
                }
            });

        setUserInputed(true);
        props.setStatusBar("Data restored.");
    }, []);

    // React.useEffect(() => {
    //     socket.connect();

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    // React.useEffect(() => {
    //     function printQuestions(data) {
    //         console.log(data);
    //     }

    //     socket.on("questions", printQuestions);

    //     return () => {
    //         socket.off("questions", printQuestions);
    //     };
    // }, []);

    // Fetches display options and populates label options
    React.useEffect(() => {
        if (file.afterInitialRender) {
            setSelectedValue({
                displayOption: file.displayType,
                trackedDataQuestionId: file.dataQuestionId,
                trackedDataTitle: file.dataTitle,
            });

            getGoogleData(`/${file.fileId}/questions`, 0);

            getGoogleData(
                `/${file.fileId}/question_responses/${file.dataQuestionId}/respondent/none`,
                1,
            );

            handleClick();
        }
    }, [file.afterInitialRender]);

    React.useEffect(() => {
        if (useAsLink) {
            getGoogleData(`/${file.fileId}/questions`, 0);
        }
    }, [useAsLink]);

    React.useEffect(() => {
        if (responsesData !== "" && file.afterInitialRender) {
            formatGoogleData();
        }
    }, [responsesData]);

    // GET Request - Requests general GET requests
    async function getGoogleData(queryUrl, dataType) {
        setLoading(true);

        return api
            .get(`/${userId}/google${queryUrl}`)
            .then((response) => {
                if (dataType === 0) {
                    setQuestionsData(response.data);
                } else if (dataType === 1) {
                    setResponsesData(response.data);
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else {
                    console.log(error);
                }
            })
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

        setUseAsLink(true);
    }

    async function saveChanges() {
        setFile({
            ...file,
            displayType: selectedValue.displayOption,
            dataQuestionId: selectedValue.trackedDataQuestionId,
        });

        await Promise.all([
            getGoogleData(
                `/${file.fileId}/question_responses/${selectedValue.trackedDataQuestionId}/respondent/none`,
                1,
            ),
            props.saveData(
                `/google/${props.sectionID}/file/${file.fileId}/type/${file.fileType}`,
            ),
            props.saveData(
                `/google/${props.sectionID}/file/${file.fileId}/display/${selectedValue.displayOption}`,
            ),
            props.saveData(
                `/google/${props.sectionID}/file/${file.fileId}/question/${selectedValue.trackedDataQuestionId}/title/${selectedValue.trackedDataTitle}`,
            ),
        ]);
    }

    function formatGoogleData() {
        switch (file.fileType) {
            case "forms":
                if (
                    file.displayType === "Pie Chart" ||
                    file.displayType === "Doughnut Chart"
                ) {
                    const dataPoints = responsesData.map(
                        (data) => data.answers.value,
                    );

                    const values = {};

                    dataPoints.forEach((value) => {
                        values[value] = (values[value] || 0) + 1;
                    });

                    setChartedData({
                        labels: Object.keys(values),
                        datasets: [
                            {
                                data: Object.values(values),
                                hoverOffset: 10,
                                borderWidth: 2,
                                axis: "y",
                            },
                        ],
                    });

                    setFile({
                        ...file,
                        dataTitle: selectedValue.trackedDataTitle,
                    });
                } else if (file.displayType === "Bar Chart") {
                    const dataPoints = responsesData.map(
                        (data) => data.answers.value,
                    );

                    const values = {};

                    dataPoints.forEach((value) => {
                        values[value] = (values[value] || 0) + 1;
                    });

                    setChartedData({
                        labels: Object.keys(values),
                        datasets: [
                            {
                                label: "Data Set 1",
                                data: Object.values(values),
                                borderWidth: 1,
                            },
                        ],
                    });

                    setFile({
                        ...file,
                        dataTitle: selectedValue.trackedDataTitle,
                    });
                } else if (file.displayType === "Line Chart") {
                    const dataPoints = responsesData.map(
                        (data) => data.answers.value,
                    );

                    const values = {};

                    dataPoints.forEach((value) => {
                        values[value] = (values[value] || 0) + 1;
                    });

                    setChartedData({
                        labels: Object.keys(values),
                        datasets: [
                            {
                                label: "Data Set 1",
                                data: Object.values(values),
                                fill: false,
                                borderColor: "white",
                                borderWidth: 1,
                                tension: 0.1,
                                pointRadius: 5,
                            },
                        ],
                    });

                    setFile({
                        ...file,
                        dataTitle: selectedValue.trackedDataTitle,
                    });
                } else if (file.displayType === "Radar Chart") {
                } else if (file.displayType === "Bubble Chart") {
                } else if (file.displayType === "Response Counter") {
                    setChartedData(responsesData.length);
                } else if (file.displayType === "Value Counter") {
                }
        }
    }

    React.useEffect(() => {
        if (!chartedData || !file.fileId) {
            setDisplayedData(
                <div className="data-display-prompt">
                    Track a new file by adding a google file <br /> link in the
                    editor!
                </div>,
            );
        }

        switch (file.displayType) {
            case "Bar Chart":
                setDisplayedData(
                    <Bar
                        className="data-chart"
                        data={chartedData}
                        options={chartOptions}
                    />,
                );
                break;
            case "Bubble Chart":
                setDisplayedData(
                    <div className="chart-tba">
                        Chart to be implemented soon!
                    </div>,
                );
                break;

            case "Doughnut Chart":
                setDisplayedData(
                    <Doughnut
                        className="data-chart"
                        data={chartedData}
                        options={options}
                    />,
                );
                break;
            case "Line Chart":
                setDisplayedData(
                    <Line
                        className="data-chart"
                        data={chartedData}
                        options={chartOptions}
                    />,
                );
                break;

            case "Pie Chart":
                setDisplayedData(
                    <Pie
                        className="data-chart"
                        data={chartedData}
                        options={options}
                    />,
                );
                break;
            case "Radar Chart":
                setDisplayedData(
                    <div className="chart-tba">
                        Chart to be implemented soon!
                    </div>,
                );
                break;
            case "Response Counter":
                setDisplayedData(
                    <div className="data-counters">
                        <h3 className="data-counters-title">Responses:</h3>
                        <h1 className="data-counters-data">{chartedData}</h1>
                    </div>,
                );
                break;

            default:
                setDisplayedData(
                    <div className="data-display-prompt">
                        Data type implemented soon!
                    </div>,
                );
        }
    }, [chartedData]);

    React.useEffect(() => {
        const handler = function (event) {
            handleClickOutside(event);
        };

        function handleClickOutside(event) {
            if (clickRef.current && !clickRef.current.contains(event.target)) {
                setLabelToInput(false);
            }
        }

        // Bind the event listener
        if (labelToInput) {
            document.addEventListener("mousedown", handler);
        }

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handler);
        };
    });

    React.useEffect(() => {
        if (userInputed && labelToInput === true) {
            props.saveLabel(props.sectionID, label);
        }
    }, [label]);

    return (
        <div className="label-div">
            {!labelToInput && (
                <label ref={clickRef} htmlFor="google-data-div">
                    {label}
                    {props.editable && (
                        <span
                            ref={clickRef}
                            className="label-editor"
                            onClick={() => setLabelToInput(true)}
                        >
                            {" "}
                            🖉
                        </span>
                    )}
                </label>
            )}
            {labelToInput && (
                <input
                    className="label-textbox"
                    ref={clickRef}
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                />
            )}
            <div id="google-data-div" className="google-data-div">
                {props.editable && (
                    <div id="google-file-section-editor">
                        <div className="google-file-url-div">
                            <p className="editor-labels">
                                Google File URL or ID
                            </p>
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
                            className="use-file-button"
                            onClick={() => handleClick()}
                        >
                            USE FILE
                        </button>
                        <div className="data-display-options">
                            <p className="editor-labels">
                                Data Display Option:
                            </p>
                            <select
                                className="display-selector"
                                value={selectedValue.displayOption}
                                onChange={(event) =>
                                    setSelectedValue({
                                        ...selectedValue,
                                        displayOption: event.target.value,
                                    })
                                }
                            >
                                {dataDisplayOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="data-label-options">
                            <p className="editor-labels">Data Point:</p>
                            <select
                                className="data-point-selector"
                                value={selectedValue.trackedDataQuestionId}
                                onChange={(event) => {
                                    setSelectedValue({
                                        ...selectedValue,
                                        trackedDataQuestionId:
                                            event.target[
                                                event.target.selectedIndex
                                            ].value,
                                        trackedDataTitle:
                                            event.target[
                                                event.target.selectedIndex
                                            ].title,
                                    });
                                }}
                            >
                                {questionsData.map((option) => (
                                    <option
                                        title={option.title}
                                        value={option.questionId}
                                        key={option.questionId}
                                    >
                                        {option.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="save-file-options-button"
                            onClick={() => saveChanges()}
                        >
                            SAVE
                        </button>
                    </div>
                )}
                {displayedData}
            </div>
        </div>
    );
}

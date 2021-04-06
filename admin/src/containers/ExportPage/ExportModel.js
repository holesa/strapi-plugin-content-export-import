import React, { useState } from "react";
import { Button } from "strapi-helper-plugin";
import { saveAs } from "file-saver";
import { fetchEntries } from "../../utils/contentApis";
import { HFlex, ModelItem } from "./ui-components";

const ExportModel = ({ model }) => {
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState(null);
  const fetchModelData = () => {
    setFetching(true);
    fetchEntries(model.apiID, model.schema.kind)
      .then((data) => {
        setContent(data);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const downloadCsv = () => {
    const array = [Object.keys(content[0])].concat(content);
    const convert = array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
    const file = new File([convert], "file.csv", {
      type: "text/csv",
    });
    saveAs(file);
  };

  return (
    <ModelItem>
      <HFlex>
        <span className="title">{model.schema.name}</span>
        <div>
          <Button
            disabled={fetching}
            loader={fetching}
            onClick={fetchModelData}
            secondaryHotline
          >
            {fetching ? "Fetching" : "Fetch"}
          </Button>
          <Button
            disabled={!content}
            onClick={downloadCsv}
            kind={content ? "secondaryHotline" : "secondary"}
          >
            Download
          </Button>
        </div>
      </HFlex>
    </ModelItem>
  );
};

export default ExportModel;

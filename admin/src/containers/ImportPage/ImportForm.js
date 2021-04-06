import React, { useState, useEffect } from "react";
import { Button, InputSelect } from "strapi-helper-plugin";
import { convertModelToOption } from "../../utils/convertOptions";
import { find, get, map } from "lodash";
import { FieldRow, FileField, FormAction } from "./ui-components";
import { readLocalFile } from "../../utils/file";
import JsonDataDisplay from "../../components/JsonDataDisplay";

const ImportForm = ({ models }) => {
  const options = map(models, convertModelToOption);
  const [loading, setLoading] = useState(false);
  const [targetModelUid, setTargetModel] = useState(undefined);
  const [sourceFile, setSourceFile] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (!targetModelUid && models && models.length > 0) {
      setTargetModel(models[0].uid);
    }
  }, [models]);

  const onTargetModelChange = (event) => {
    setTargetModel(event.target.value);
  };

  const onSourceFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSource(null);
      setSourceFile(event.target.files[0]);
    }
  };

  const submit = () => {
    if (!targetModelUid) {
      strapi.notification.error("Please select a target content type!");
      return;
    }
    setLoading(true);
    const model = find(models, (model) => model.uid === targetModelUid);
    readLocalFile(sourceFile, model)
      .then((setSource) => {
        strapi.notification.success("Import succeeded!");
      })
      .catch((error) => {
        strapi.notification.error(
          "Something wrong when importing the file, please check the file and try again."
        );
        console.error(error);
        })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div>
      <FieldRow>
        <label htmlFor="source">Content Source File</label>
        <FileField>
          <input
            id="source"
            name="source"
            accept={".csv"}
            type="file"
            onChange={onSourceFileChange}
          />
        </FileField>
      </FieldRow>
      <FieldRow>
        <label htmlFor="target-content-type">Target Content Type</label>
        <InputSelect
          name="targetContentType"
          id="target-content-type"
          selectOptions={options}
          value={targetModelUid}
          onChange={onTargetModelChange}
        />
      </FieldRow>
      <FormAction>
        <Button disabled={loading} onClick={submit} primary>
          {loading ? "Please Wait..." : "Import"}
        </Button>
      </FormAction>
    </div>
  );
};

export default ImportForm;

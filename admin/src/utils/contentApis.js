import { request } from "strapi-helper-plugin";
import { filter } from 'lodash';
import pluralize from 'pluralize';
import {MODEL_KIND} from "../constants/model-kind";

export const getModels = () => {
  return request("/content-type-builder/content-types", {
    method: "GET",
  }).then((response) => {
    return filter(response.data, (model) => !model.plugin)
  }).catch(() => {
    return [];
  });
};

export const fetchEntries = (apiId, kind) => {
  const url = (kind === MODEL_KIND.collection) ? `/${pluralize(apiId)}?_limit=10000000` : `/${apiId}?_limit=10000000`;
  console.log(url)
  return request(url, { method: 'GET'});
};

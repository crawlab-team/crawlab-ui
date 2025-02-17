interface LComponentsExport {
  type: string;
  target: string;
  types: {
    csv: string;
    json: string;
    xlsx: string;
  };
  exporting: {
    csv: string;
    json: string;
    xlsx: string;
  };
  status: {
    exporting: string;
  };
}

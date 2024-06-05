import { SidebarAppSDK } from "@contentful/app-sdk";
import { Box, Flex } from "@contentful/f36-components";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState } from "react";
const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const cma = sdk.cma;
  const instanceParameters = sdk.parameters.instance; // From App Definition
  const appliedRefEntryType =
    instanceParameters?.referenceEntryType ?? undefined;
  const fields = sdk.contentType.fields;
  // ideally, should return all the field that are of type Reference
  // for now, assume only one reference field
  const referenceField = fields.find(
    (field) =>
      field.type === "Array" &&
      field.items?.type === "Link" &&
      field.items.linkType === "Entry"
  );
  const [refEntries, setRefEntries] = useState<any[] | undefined>();
  const [shouldDisplayColorCodes, setShouldDisplayColorCodes] = useState(false);

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  useEffect(() => {
    // if there is a Reference typed Field
    if (referenceField) {
      const onRefChanged = (value: any) => {
        setRefEntries(value);
      };

      sdk.entry.fields[referenceField.id].onValueChanged(onRefChanged);
      // get all children referenced entries
      const refEntries = sdk.entry.fields[referenceField.id].getValue();
      if (refEntries) {
        setRefEntries(refEntries);
      } else {
        setRefEntries(undefined);
      }
    }
  }, [referenceField, sdk.entry.fields]);

  useEffect(() => {
    if (refEntries && refEntries.length > 0) {
      const params = {
        query: {
          content_type: appliedRefEntryType,
          "sys.id[in]": refEntries.map((entry) => entry.sys.id).join(","),
        },
      };

      cma.entry.getMany(params).then((response) => {
        if (response.items.length > 0) {
          setShouldDisplayColorCodes(true);
        } else {
          setShouldDisplayColorCodes(false);
        }
      });
    } else {
      setShouldDisplayColorCodes(false);
    }
  }, [appliedRefEntryType, cma.entry, refEntries]);
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  if (shouldDisplayColorCodes) {
    return (
      <Flex flexDirection="column" gap="spacingS">
        <Flex flexDirection="row" gap="spacingS" alignItems="center">
          <Box
            style={{
              backgroundColor: "green",
              height: "20px",
              width: "20px",
            }}
          />
          <span>Common across brands and products</span>
        </Flex>

        <Flex flexDirection="row" gap="spacingS" alignItems="center">
          <Box
            style={{
              backgroundColor: "yellow",
              height: "20px",
              width: "20px",
            }}
          />
          <span>Product specific</span>
        </Flex>

        <Flex flexDirection="row" gap="spacingS" alignItems="center">
          <Box
            style={{
              backgroundColor: "blue",
              height: "20px",
              width: "20px",
            }}
          />
          <span>Brand specific</span>
        </Flex>

        <Flex flexDirection="row" gap="spacingS" alignItems="center">
          <Box
            style={{
              backgroundColor: "red",
              height: "20px",
              width: "20px",
            }}
          />
          <span>Brand and Product specific</span>
        </Flex>
      </Flex>
    );
  }
};

export default Sidebar;

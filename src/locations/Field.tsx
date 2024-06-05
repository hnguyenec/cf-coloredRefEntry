import { FieldAppSDK } from "@contentful/app-sdk";
import { MultipleEntryReferenceEditor } from "@contentful/field-editor-reference";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import styled from "@emotion/styled";
import { useEffect } from "react";

const StyledRefDiv = styled.div<{ name: string }>`
  border: ${(props) => {
    return props.name === "brand-specific"
      ? "5px solid blue"
      : props.name === "product-specific"
      ? "5px solid yellow"
      : props.name === "brand-product-specific"
      ? "5px solid red"
      : "5px solid green";
  }};
  border-radius: 8px;
`;
const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const instanceParameters = sdk.parameters.instance; // From App Definition
  const appliedRefEntryType =
    instanceParameters?.referenceEntryType ?? undefined;

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/

  return (
    <MultipleEntryReferenceEditor
      viewType="link"
      sdk={sdk}
      isInitiallyDisabled={true}
      hasCardEditActions={true}
      parameters={{
        instance: {
          showCreateEntityAction: true,
          showLinkEntityAction: true,
        },
      }}
      renderCustomCard={(props, _, renderDefaultCard) => {
        const entityTags = props.entity.metadata?.tags;
        const hasBrandTags = entityTags?.some((tag) =>
          tag.sys.id.startsWith("brand")
        );
        const hasProductTags = entityTags?.some((tag) =>
          tag.sys.id.startsWith("product")
        );
        // construct className based on tags
        // if has only brand tags, no product tags, className = 'brand-specific'
        // if has only product tags, no brand tags, className = 'product-specific'
        // if has both product tags and brand tags, className = 'brand-product-specific'
        // if has neither product tags nor brand tags, className = 'common'
        const className =
          hasBrandTags && hasProductTags
            ? "brand-product-specific"
            : hasBrandTags
            ? "brand-specific"
            : hasProductTags
            ? "product-specific"
            : "common";

        return appliedRefEntryType === props.entity.sys.contentType.sys.id ? (
          <StyledRefDiv name={className}>
            {
              // @ts-expect-error
              renderDefaultCard({ size: "small" })
            }
          </StyledRefDiv>
        ) : (
          // @ts-expect-error
          renderDefaultCard({ size: "small" })
        );
      }}
    />
  );
};

export default Field;

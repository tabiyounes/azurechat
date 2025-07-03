// complaint-service.ts
import { HistoryContainer } from "@/features/common/services/cosmos";
import { SqlQuerySpec } from "@azure/cosmos";
import { COMPLAINT_ATTRIBUTE, ComplaintModel, ComplaintModelSchema } from "./models";
import { ServerActionResponse, zodErrorsToServerActionErrors } from "@/features/common/server-action-response";
import { uniqueId } from "@/features/common/util";
import { getCurrentUser, userHashedId } from "@/features/auth-page/helpers";

interface ComplaintInput {
  causeTechnique: string;
  actionCorrective: string;
  actionClient?: string;
}

const ValidateSchema = (model: ComplaintModel): ServerActionResponse => {
  const validatedFields = ComplaintModelSchema.safeParse(model);

  if (!validatedFields.success) {
    return {
      status: "ERROR",
      errors: zodErrorsToServerActionErrors(validatedFields.error.errors),
    };
  }

  return {
    status: "OK",
    response: model,
  };
};


export const GetAllComplaints = async (): Promise<ServerActionResponse<ComplaintModel[]>> => {
  try {
      const querySpec: SqlQuerySpec = {
        query: "SELECT * FROM root r WHERE r.type=@type",
        parameters: [
          {
            name: "@type",
            value: COMPLAINT_ATTRIBUTE,
          },
        ],
      };

    const { resources } = await HistoryContainer()
      .items.query<ComplaintModel>(querySpec)
      .fetchAll();

    return {
      status: "OK",
      response: resources,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [
        {
          message: `Error fetching complaints: ${error}`,
        },
      ],
    };
  }
};

export const CreateComplaint = async (
  props: ComplaintInput
): Promise<ServerActionResponse<ComplaintModel>> => {
  try {
    const user = await getCurrentUser();

    const modelToSave: ComplaintModel = {
      id: uniqueId(),
      causeTechnique: props.causeTechnique,
      actionCorrective: props.actionCorrective,
      actionClient: props.actionClient,
      createdAt: new Date(),
      userId: await userHashedId(),
    };

    const valid = ValidateSchema(modelToSave);

    if (valid.status !== "OK") {
      return valid;
    }

    const { resource } = await HistoryContainer().items.create<ComplaintModel>(
      modelToSave
    );

    if (resource) {
      return {
        status: "OK",
        response: resource,
      };
    } else {
      return {
        status: "ERROR",
        errors: [
          {
            message: "Error creating complaint",
          },
        ],
      };
    }
  } catch (error) {
    return {
      status: "ERROR",
      errors: [
        {
          message: `Error creating complaint: ${error}`,
        },
      ],
    };
  }
};

import { notification } from "antd";

type NotificationType = "success" | "error" | "info" | "warning";
type PlacementType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

const ToastMsg = (
    type: NotificationType,
    description?: string,
    placement: PlacementType = "topRight"
) => {
    if (placement === "topRight") {
        notification.config({
            placement,
            top: 70, 
        });
    }

    notification[type]({
        message: ' ',
        description: <span style={{ marginRight: "20px" }}>{description}</span>,
        placement,
        duration: 5,
    });
};

export default ToastMsg;

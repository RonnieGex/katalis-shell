import { type BusinessId } from "./sections.js";
export declare function useKatalisBusiness(onBusinessChange?: (id: BusinessId) => void): {
    value: "all" | "orbita" | "rock-and-jewel" | "dental" | "katalis-lab";
    ready: boolean;
    options: readonly [{
        readonly id: "all";
        readonly label: "Todos los negocios";
    }, {
        readonly id: "orbita";
        readonly label: "Órbita";
    }, {
        readonly id: "rock-and-jewel";
        readonly label: "Rock & Jewel";
    }, {
        readonly id: "dental";
        readonly label: "Dental";
    }, {
        readonly id: "katalis-lab";
        readonly label: "Katalis Lab";
    }];
    onChange: (id: string) => void;
};

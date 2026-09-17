declare function selectBusiness(value: string): void;
export declare function useKatalisBusiness(): {
    value: "orbita" | "rock-and-jewel" | "dental" | "katalis-lab";
    options: readonly [{
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
    onChange: typeof selectBusiness;
};
export {};

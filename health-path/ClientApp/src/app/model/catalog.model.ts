
interface NaturalProduct {
    readonly licenceNo: string;
    readonly productName: string;
    readonly companyName: string;
    readonly active: boolean;
    readonly purposes: readonly string[];
    readonly route: string[];
}

export { NaturalProduct };

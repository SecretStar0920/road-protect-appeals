import { ApiModelProperty } from '@nestjs/swagger';

export class PaymentRequest {
    @ApiModelProperty()
    card: {
        cardMask: string;
        cardholderName: string;
        expiry: string;
    };

    @ApiModelProperty()
    type: string;

    @ApiModelProperty()
    testMode: boolean;

    @ApiModelProperty()
    token: string;

    @ApiModelProperty()
    payerEmail: string;

    @ApiModelProperty()
    payerName: string;

    @ApiModelProperty()
    payerPhone: string;

    @ApiModelProperty()
    payerSocialId: string;

    @ApiModelProperty()
    total: {
        label: string;
        amount: {
            currency: string;
            value: string;
        };
    };
}

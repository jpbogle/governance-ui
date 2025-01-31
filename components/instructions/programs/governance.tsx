import { AccountMetaData, VoteWeightSource } from '@models/accounts'
import { SetGovernanceConfigArgs } from '@models/instructions'
import { GOVERNANCE_SCHEMA } from '@models/serialisation'
import { Connection } from '@solana/web3.js'
import { fmtMintAmount, getDaysFromTimestamp } from '@tools/sdk/units'
import { deserialize } from 'borsh'

import { getGovernance, getRealm } from '@models/api'
import { tryGetMint } from '../../../utils/tokens'

export const GOVERNANCE_INSTRUCTIONS = {
  GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw: {
    19: {
      name: 'Set Governance Config',
      accounts: [{ name: 'Governance' }],
      getDataUI: async (
        connection: Connection,
        data: Uint8Array,
        accounts: AccountMetaData[]
      ) => {
        const args = deserialize(
          GOVERNANCE_SCHEMA,
          SetGovernanceConfigArgs,
          Buffer.from(data)
        ) as SetGovernanceConfigArgs

        const governance = await getGovernance(connection, accounts[0].pubkey)
        const realm = await getRealm(connection, governance.info.realm)
        const communityMint = await tryGetMint(
          connection,
          realm.info.communityMint
        )
        const councilMint = realm.info.config.councilMint
          ? await tryGetMint(connection, realm.info.config.councilMint)
          : undefined

        console.log('COMMUNITY MINT', {
          mint: communityMint?.account.decimals,
          governance,
          realm,
        })

        return (
          <>
            <p>
              {`voteThresholdPercentage:
              ${args.config.voteThresholdPercentage.value.toLocaleString()}%`}
            </p>
            <p>
              {`minCommunityTokensToCreateProposal:
              ${fmtMintAmount(
                communityMint?.account,
                args.config.minCommunityTokensToCreateProposal
              )}`}
            </p>
            <p>
              {`minCouncilTokensToCreateProposal:
              ${fmtMintAmount(
                councilMint?.account,
                args.config.minCouncilTokensToCreateProposal
              )}`}
            </p>
            <p>
              {`minInstructionHoldUpTime:
              ${getDaysFromTimestamp(
                args.config.minInstructionHoldUpTime
              )} day(s)`}
            </p>
            <p>
              {`maxVotingTime:
              ${getDaysFromTimestamp(args.config.maxVotingTime)} days(s)`}
            </p>
            <p>
              {`voteWeightSource:
              ${VoteWeightSource[args.config.voteWeightSource]}`}
            </p>
            <p>
              {`proposalCoolOffTime:
              ${getDaysFromTimestamp(args.config.proposalCoolOffTime)} days(s)`}
            </p>
          </>
        )
      },
    },
  },
}

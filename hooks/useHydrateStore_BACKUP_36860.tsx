import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getRealmInfo } from '../models/registry/api'
import { EndpointTypes } from '../models/types'
import useWalletStore from '../stores/useWalletStore'

export default function useHydrateStore() {
  const router = useRouter()
  const { symbol, cluster, pk } = router.query
  const apiEndpoint = cluster ? (cluster as EndpointTypes) : 'mainnet'
<<<<<<< HEAD
  const selectedRealmMints = useWalletStore((s) => s.selectedRealm.mints)
  const setWalletStore = useWalletStore((s) => s.set)
  const { fetchAllRealms, fetchRealm, fetchProposal } = useWalletStore(
    (s) => s.actions
  )
||||||| parent of 6775174 (Lazily set connection)
  const mints = useWalletStore((s) => s.mints)
  const setWalletStore = useWalletStore((s) => s.set)
  const { fetchAllRealms, fetchRealm, fetchProposal } = useWalletStore(
    (s) => s.actions
  )
=======
  const mints = useWalletStore((s) => s.mints)
  const {
    fetchAllRealms,
    fetchRealm,
    fetchProposal,
    setConnectionConfig,
  } = useWalletStore((s) => s.actions)
>>>>>>> 6775174 (Lazily set connection)
  useEffect(() => {
    const fetch = async () => {
      const realmInfo = getRealmInfo(symbol as string, apiEndpoint)
      setConnectionConfig(apiEndpoint)
      if (realmInfo) {
        await fetchAllRealms(realmInfo.programId)
        fetchRealm(realmInfo.programId, realmInfo.realmId)
      }
    }
    fetch()
  }, [symbol, cluster])

  useEffect(() => {
    const fetch = async () => {
      if (pk && Object.entries(selectedRealmMints).length > 0) {
        await fetchProposal(pk)
      }
    }
    fetch()
  }, [pk, selectedRealmMints])
}

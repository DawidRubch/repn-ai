import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

export const CalendarIntegrationModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onClose: () => void;
  onSkip: () => void;
  onIntegrate: () => void;
}> = ({ isModalOpen, setIsModalOpen, onClose, onSkip, onIntegrate }) => (
  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Last Step</DialogTitle>
        <DialogDescription>
          Integrate Google Calendar to allow agent to book meetings.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onSkip}>Skip</Button>
        <Button onClick={onIntegrate}>Integrate</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
